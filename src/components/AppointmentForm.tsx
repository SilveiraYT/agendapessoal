import React, { useState, useEffect } from 'react';
import type { Appointment, Professional, ServiceKah, ServiceMarcia } from '../types';

interface Props {
  initialData?: Appointment | null;
  currentProfile: Professional;
  onSubmit: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const servicesKah: ServiceKah[] = ['Relaxante', 'Terapêutica', 'Modeladora', 'Drenagem linfática', 'Desportiva', 'Bioenergética'];
const servicesMarcia: ServiceMarcia[] = ['Manicure', 'Pedicure', 'Alongamento de Unhas', 'Design de Sobrancelhas', 'Sobrancelha com Henna', 'Micropigmentação', 'Lash Lifting'];

// Generate times from 09:00 to 20:00 (every 30 mins)
const generateTimeSlots = () => {
  const times = [];
  for (let h = 9; h <= 20; h++) {
    const hour = h.toString().padStart(2, '0');
    times.push(`${hour}:00`);
    if (h !== 20) times.push(`${hour}:30`);
  }
  return times;
};

const TIME_SLOTS = generateTimeSlots();

const AppointmentForm: React.FC<Props> = ({ initialData, currentProfile, onSubmit, onCancel }) => {
  const [professional, setProfessional] = useState<Professional>(initialData?.professional || currentProfile);
  const [service, setService] = useState<string>(initialData?.service || (professional === 'Kah' ? servicesKah[0] : servicesMarcia[0]));
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  
  // Basic phone formatting
  const formatPhone = (val: string) => {
    const v = val.replace(/\D/g, '');
    let formatted = v;
    if (v.length > 2) formatted = `(${v.substring(0,2)}) ` + v.substring(2);
    if (v.length > 7) formatted = formatted.substring(0, 10) + '-' + formatted.substring(10, 14);
    return formatted;
  };
  
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialData?.time || '09:00');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Update available service if professional changes
  useEffect(() => {
    if (!initialData || professional !== initialData.professional) {
      setService(professional === 'Kah' ? servicesKah[0] : servicesMarcia[0]);
    }
  }, [professional, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      professional,
      service,
      clientName,
      phone,
      date,
      time,
      notes,
      lastModifiedBy: currentProfile
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const availableServices = professional === 'Kah' ? servicesKah : servicesMarcia;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '1rem', zIndex: 100
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="mb-4">{initialData ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Profissional</label>
            <select 
              className="input-field" 
              value={professional} 
              onChange={e => setProfessional(e.target.value as Professional)}
            >
              <option value="Kah">Kah (Massoterapia)</option>
              <option value="Márcia">Márcia (Unhas/Sobrancelhas)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Serviço</label>
            <select className="input-field" value={service} onChange={e => setService(e.target.value)} required>
              {availableServices.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Nome da Cliente</label>
            <input 
              className="input-field" 
              type="text" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
              required 
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Telefone / WhatsApp</label>
            <input 
              className="input-field" 
              type="tel" 
              value={phone} 
              onChange={handlePhoneChange} 
              required 
              placeholder="(11) 90000-0000"
              maxLength={15}
            />
          </div>

          <div className="flex gap-4">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Data</label>
              <input 
                className="input-field" 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Horário</label>
              <select className="input-field" value={time} onChange={e => setTime(e.target.value)} required>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Observações</label>
            <textarea 
              className="input-field" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              rows={3} 
              placeholder="Opcional..."
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
