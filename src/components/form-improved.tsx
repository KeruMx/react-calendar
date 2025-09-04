import React, { useState } from 'react';
import { FormProps, Event } from '../lib/types-improved';
import { format } from "date-fns";

export const FormImproved = (props: FormProps) => {
  const { 
    event, 
    onAddEvent, 
    onUpdateEvent, 
    onDeleteEvent, 
    onCancel,
    loading = false,
    error = null 
  } = props;

  const [formData, setFormData] = useState({
    title: event?.title || '',
    fechaInicio: event?.start ? format(event.start, 'yyyy-MM-dd') : '',
    horaInicio: event?.start ? format(event.start, 'HH:mm') : '',
    horaFin: event?.end ? format(event.end, 'HH:mm') : '',
    color: event?.color || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'El título es requerido';
    }

    if (!formData.fechaInicio) {
      errors.fechaInicio = 'La fecha es requerida';
    }

    if (!formData.horaInicio) {
      errors.horaInicio = 'La hora de inicio es requerida';
    }

    if (!formData.horaFin) {
      errors.horaFin = 'La hora de fin es requerida';
    }

    if (formData.horaInicio && formData.horaFin) {
      const startTime = new Date(`${formData.fechaInicio}T${formData.horaInicio}`);
      const endTime = new Date(`${formData.fechaInicio}T${formData.horaFin}`);
      
      if (endTime <= startTime) {
        errors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: Event = {
        id: event?.id || '',
        title: formData.title.trim(),
        start: new Date(`${formData.fechaInicio}T${formData.horaInicio}`),
        end: new Date(`${formData.fechaInicio}T${formData.horaFin}`),
        color: formData.color || undefined
      };

      if (event?.id) {
        // Actualizar evento existente
        await onUpdateEvent?.(event.id, eventData);
      } else {
        // Crear nuevo evento
        await onAddEvent?.(eventData);
      }
    } catch (error) {
      console.error('Error al guardar evento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      setIsSubmitting(true);
      try {
        await onDeleteEvent?.(event.id);
      } catch (error) {
        console.error('Error al eliminar evento:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="space-y-4">
      {/* Mostrar errores globales */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
        {/* Campo Título */}
        <label className="space-y-1">
          <span className="text-sm font-medium">Título *</span>
          <input 
            type="text" 
            className={`w-full p-2 border rounded-md text-sm ${
              validationErrors.title 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isFormDisabled}
            placeholder="Ingresa el título del evento"
          />
          {validationErrors.title && (
            <span className="text-red-500 text-xs">{validationErrors.title}</span>
          )}
        </label>

        {/* Campo Fecha */}
        <label className="space-y-1">
          <span className="text-sm font-medium">Fecha *</span>
          <input 
            type="date" 
            className={`w-full p-2 border rounded-md text-sm ${
              validationErrors.fechaInicio 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={formData.fechaInicio}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            disabled={isFormDisabled}
          />
          {validationErrors.fechaInicio && (
            <span className="text-red-500 text-xs">{validationErrors.fechaInicio}</span>
          )}
        </label>

        {/* Campos de Hora */}
        <div className='flex space-x-2'>
          <label className="flex-1 space-y-1">
            <span className="text-sm font-medium">Hora Inicio *</span>
            <input 
              type="time" 
              className={`w-full p-2 border rounded-md text-sm ${
                validationErrors.horaInicio 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              value={formData.horaInicio}
              onChange={(e) => handleChange('horaInicio', e.target.value)}
              disabled={isFormDisabled}
            />
            {validationErrors.horaInicio && (
              <span className="text-red-500 text-xs">{validationErrors.horaInicio}</span>
            )}
          </label>

          <label className="flex-1 space-y-1">
            <span className="text-sm font-medium">Hora Fin *</span>
            <input 
              type="time" 
              className={`w-full p-2 border rounded-md text-sm ${
                validationErrors.horaFin 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              value={formData.horaFin}
              onChange={(e) => handleChange('horaFin', e.target.value)}
              disabled={isFormDisabled}
            />
            {validationErrors.horaFin && (
              <span className="text-red-500 text-xs">{validationErrors.horaFin}</span>
            )}
          </label>
        </div>

        {/* Campo Color */}
        <label className="space-y-1">
          <span className="text-sm font-medium">Color</span>
          <select
            className={`w-full p-2 border rounded-md text-sm ${
              isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-blue-500'
            }`}
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            disabled={isFormDisabled}
          >
            <option value="">Por defecto (Azul)</option>
            <option value="bg-red-400">Rojo</option>
            <option value="bg-green-400">Verde</option>
            <option value="bg-yellow-400">Amarillo</option>
            <option value="bg-purple-400">Morado</option>
            <option value="bg-pink-400">Rosa</option>
            <option value="bg-indigo-400">Índigo</option>
          </select>
        </label>

        {/* Botones */}
        <div className="flex space-x-2 pt-2">
          <button 
            className={`flex-1 p-2 rounded-md text-sm font-medium ${
              isFormDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            type='submit'
            disabled={isFormDisabled}
          >
            {isSubmitting ? 'Guardando...' : (event?.id ? 'Actualizar' : 'Crear')}
          </button>

          {event?.id && (
            <button 
              type="button"
              className={`px-4 p-2 rounded-md text-sm font-medium ${
                isFormDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              onClick={handleDelete}
              disabled={isFormDisabled}
            >
              {isSubmitting ? '...' : 'Eliminar'}
            </button>
          )}

          {onCancel && (
            <button 
              type="button"
              className="px-4 p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
