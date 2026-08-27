import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, subDays, isSameDay, parseISO, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment, Professional } from '../types';
import { getAppointments, addAppointment, updateAppointment, deleteAppointment, subscribeToAppointments } from '../services/db';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentForm from '../components/AppointmentForm';

interface Props {
  profile: Professional;
  onLogout: () => void;
}

type ViewMode = 'dia' | 'proximos' | 'finalizados';
type FilterMode = 'Todos' | Professional;

const Dashboard: React.FC<Props> = ({ profile, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dia');
  const [filterMode, setFilterMode] = useState<FilterMode>('Todos');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    // Initial fetch
    getAppointments().then(setAppointments);
    // Real-time subscription
    const unsubscribe = subscribeToAppointments(setAppointments);
    return () => unsubscribe();
  }, []);

  const handlePreviousDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setCurrentDate(parseISO(e.target.value));
  };

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    
    if (filterMode !== 'Todos') {
      filtered = filtered.filter(a => a.professional === filterMode);
    }
    
    if (viewMode === 'finalizados') {
      filtered = filtered.filter(a => a.status === 'finalizado');
      // Sort finished appointments by most recent (descending)
      return filtered.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
    } else {
      // Exclude finished appointments from Dia and Proximos views
      filtered = filtered.filter(a => a.status !== 'finalizado');
      
      if (viewMode === 'dia') {
        filtered = filtered.filter(a => isSameDay(parseISO(a.date), currentDate));
      } else {
        // Upcoming: today or future
        const today = startOfDay(new Date());
        filtered = filtered.filter(a => {
          const apptDate = parseISO(a.date);
          return isSameDay(apptDate, today) || isAfter(apptDate, today);
        });
      }
      
      // Sort chronologically (ascending)
      return filtered.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
    }
  }, [appointments, viewMode, filterMode, currentDate]);

  const handleSaveAppt = async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAppt) {
      await updateAppointment(editingAppt.id, data);
    } else {
      await addAppointment({ ...data, status: 'agendado' });
    }
    setShowForm(false);
    setEditingAppt(null);
  };

  const handleDeleteAppt = async (id: string) => {
    await deleteAppointment(id);
  };

  const handleFinishAppt = async (id: string) => {
    await updateAppointment(id, { status: 'finalizado' });
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Olá, {profile}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Agenda Interna</p>
        </div>
        <button onClick={onLogout} style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sair</button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button 
          className={`btn ${viewMode === 'dia' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, padding: '0.5rem' }}
          onClick={() => setViewMode('dia')}
        >
          Dia
        </button>
        <button 
          className={`btn ${viewMode === 'proximos' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, padding: '0.5rem' }}
          onClick={() => setViewMode('proximos')}
        >
          Próximos
        </button>
        <button 
          className={`btn ${viewMode === 'finalizados' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, padding: '0.5rem' }}
          onClick={() => setViewMode('finalizados')}
        >
          Finalizados
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <select 
          className="input-field" 
          value={filterMode} 
          onChange={e => setFilterMode(e.target.value as FilterMode)}
          style={{ padding: '0.5rem' }}
        >
          <option value="Todos">Todas as Profissionais</option>
          <option value="Kah">Apenas Kah</option>
          <option value="Márcia">Apenas Márcia</option>
        </select>
      </div>

      {/* Date Navigation for Day View */}
      {viewMode === 'dia' && (
        <div className="flex justify-between items-center mb-6 card" style={{ padding: '0.75rem' }}>
          <button onClick={handlePreviousDay} style={{ padding: '0.5rem', fontWeight: 'bold' }}>&lt;</button>
          
          <div className="flex flex-col items-center">
            <span style={{ fontWeight: 600 }}>
              {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
            <input 
              type="date" 
              value={format(currentDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}
            />
          </div>

          <button onClick={handleNextDay} style={{ padding: '0.5rem', fontWeight: 'bold' }}>&gt;</button>
        </div>
      )}

      {/* Appointments List */}
      <div>
        {filteredAppointments.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>
            Nenhum agendamento encontrado.
          </div>
        ) : (
          filteredAppointments.map(appt => (
            <React.Fragment key={appt.id}>
              {viewMode === 'proximos' && (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', marginTop: '16px' }}>
                  {format(parseISO(appt.date), "dd/MM/yyyy - EEEE", { locale: ptBR })}
                </div>
              )}
              <AppointmentCard 
                appointment={appt} 
                onEdit={(a) => { setEditingAppt(a); setShowForm(true); }}
                onDelete={handleDeleteAppt}
                onFinish={handleFinishAppt}
              />
            </React.Fragment>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        className="btn-primary shadow-lg"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          zIndex: 90
        }}
        onClick={() => { setEditingAppt(null); setShowForm(true); }}
      >
        +
      </button>

      {/* Form Modal */}
      {showForm && (
        <AppointmentForm 
          initialData={editingAppt}
          currentProfile={profile}
          onSubmit={handleSaveAppt}
          onCancel={() => { setShowForm(false); setEditingAppt(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
