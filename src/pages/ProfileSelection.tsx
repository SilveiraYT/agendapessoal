import React from 'react';
import type { Professional } from '../types';

interface Props {
  onSelect: (profile: Professional) => void;
}

const ProfileSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="card text-center animate-fade-in">
        <h1 className="mb-6" style={{ color: 'var(--primary)', fontWeight: 700 }}>Agenda Interna</h1>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Selecione seu perfil para acessar</p>
        
        <div className="flex flex-col gap-4">
          <button 
            className="btn btn-primary" 
            style={{ padding: '1.5rem', fontSize: '1.25rem' }}
            onClick={() => onSelect('Kah')}
          >
            🌺 Sou a Kah
          </button>
          
          <button 
            className="btn btn-secondary" 
            style={{ padding: '1.5rem', fontSize: '1.25rem', backgroundColor: 'var(--secondary)', color: 'white' }}
            onClick={() => onSelect('Márcia')}
          >
            💅 Sou a Márcia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
