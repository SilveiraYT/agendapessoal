import React from 'react';
import type { Appointment } from '../types';

interface Props {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onFinish?: (id: string) => void;
}

const AppointmentCard: React.FC<Props> = ({ appointment, onEdit, onDelete, onFinish }) => {
  const isKah = appointment.professional === 'Kah';
  const isFinished = appointment.status === 'finalizado';
  
  const handleWhatsApp = () => {
    const cleanPhone = appointment.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div 
      className="card mb-4 animate-fade-in" 
      style={{ 
        borderLeft: `4px solid ${isKah ? 'var(--primary)' : 'var(--secondary)'}`,
        position: 'relative'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{appointment.time}</span>
        <span 
          style={{ 
            fontSize: '0.75rem', 
            padding: '2px 8px', 
            borderRadius: '99px',
            backgroundColor: isKah ? 'var(--primary-light)' : 'var(--secondary-light)',
            color: isKah ? 'var(--primary-hover)' : '#d81b60',
            fontWeight: 500
          }}
        >
          {appointment.professional}
        </span>
      </div>
      
      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{appointment.clientName}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
        {appointment.service}
      </p>
      
      {appointment.notes && (
        <p style={{ fontSize: '0.875rem', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px', marginBottom: '12px' }}>
          {appointment.notes}
        </p>
      )}

      <div className="flex gap-2 mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <button 
          className="btn btn-secondary" 
          style={{ flex: 1, padding: '0.5rem', backgroundColor: '#25D366', color: 'white' }}
          onClick={handleWhatsApp}
        >
          WhatsApp
        </button>
        
        {!isFinished && onFinish && (
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.5rem 1rem', color: 'var(--primary)', borderColor: 'var(--primary-light)' }}
            onClick={() => onFinish(appointment.id)}
          >
            Finalizar
          </button>
        )}

        <button 
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem' }}
          onClick={() => onEdit(appointment)}
        >
          Editar
        </button>
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: '#fee2e2' }}
          onClick={() => {
            if(window.confirm('Tem certeza que deseja excluir este agendamento?')) {
              onDelete(appointment.id);
            }
          }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
