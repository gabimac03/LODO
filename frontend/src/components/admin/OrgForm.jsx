import React, { useState, useEffect } from 'react';
import { adminCreateOrganization as createOrganization, adminGeocodeOrganization as geocodeOrganization, adminUpdateOrganization as updateOrganizationCoordinates } from '../../services/api';

export default function OrgForm({ onCreated, editingOrg, onClear }) {
    const initialForm = {
        id: '',
        name: '',
        organizationType: '',
        sectorPrimary: '',
        sectorSecondary: '',
        stage: '',
        outcomeStatus: '',
        country: '',
        region: '',
        city: '',
        website: '',
        notes: '',
        lat: '',
        lng: ''
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingOrg) {
            setForm({
                ...editingOrg,
                lat: editingOrg.lat || '',
                lng: editingOrg.lng || '',
                sectorSecondary: editingOrg.sectorSecondary || '',
                stage: editingOrg.stage || '',
                website: editingOrg.website || '',
                notes: editingOrg.notes || ''
            });
        } else {
            setForm(initialForm);
        }
    }, [editingOrg]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingOrg) return; // En modo edición no usamos el submit del form completo para crear

        setLoading(true);
        setError(null);

        const payload = { ...form };
        if (payload.lat) payload.lat = parseFloat(payload.lat);
        if (payload.lng) payload.lng = parseFloat(payload.lng);

        if ((payload.lat && !payload.lng) || (!payload.lat && payload.lng)) {
            setError("Si incluyes coordenadas, debes poner Latitud y Longitud.");
            setLoading(false);
            return;
        }

        try {
            await createOrganization(payload);
            alert("Organización creada exitosamente (DRAFT)");
            onCreated();
            setForm(initialForm);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGeocode = async () => {
        if (!editingOrg) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await geocodeOrganization(editingOrg.id);
            setForm(prev => ({ ...prev, lat: updated.lat, lng: updated.lng }));
            alert("Coordenadas encontradas y guardadas!");
            onCreated(); // Refresh list to see updated search/status if needed
        } catch (err) {
            setError("Error geocodificando: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCoords = async () => {
        if (!editingOrg) return;
        setLoading(true);
        setError(null);
        try {
            const lat = parseFloat(form.lat);
            const lng = parseFloat(form.lng);
            if (isNaN(lat) || isNaN(lng)) {
                throw new Error("Latitud y Longitud deben ser números válidos");
            }
            await updateOrganizationCoordinates(editingOrg.id, { lat, lng });
            alert("Coordenadas actualizadas manualmente!");
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container" style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: editingOrg ? '2px solid #2563eb' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{editingOrg ? 'Editar / Coordenadas' : 'Crear Organización'}</h3>
                {editingOrg && <button onClick={onClear} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Limpiar X</button>}
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.8rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: editingOrg ? 'span 2' : 'span 1' }}>
                    <label>ID</label>
                    <input name="id" value={form.id} onChange={handleChange} required disabled={!!editingOrg} className="filter-select" />
                </div>
                {!editingOrg && (
                    <div>
                        <label>Nombre</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="filter-select" />
                    </div>
                )}

                {/* En modo edición mostramos menos campos si solo queremos coords, pero dejamos los campos de ubicación para geocode context */}
                <div>
                    <label>País</label>
                    <input name="country" value={form.country} onChange={handleChange} required disabled={!!editingOrg} className="filter-select" />
                </div>
                <div>
                    <label>Ciudad</label>
                    <input name="city" value={form.city} onChange={handleChange} required disabled={!!editingOrg} className="filter-select" />
                </div>

                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '4px', gridColumn: 'span 2' }}>
                    <label style={{ fontWeight: 'bold', color: '#1e40af' }}>Coordenadas</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Latitud</label>
                            <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} className="filter-select" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Longitud</label>
                            <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} className="filter-select" />
                        </div>
                    </div>
                    {editingOrg && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={handleGeocode} disabled={loading} style={actionBtnStyle('#10b981')}>
                                🔍 Buscar Coords (API)
                            </button>
                            <button type="button" onClick={handleUpdateCoords} disabled={loading} style={actionBtnStyle('#2563eb')}>
                                💾 Guardar Coords
                            </button>
                        </div>
                    )}
                </div>

                {!editingOrg && (
                    <>
                        <div>
                            <label>Tipo</label>
                            <input name="organizationType" value={form.organizationType} onChange={handleChange} required className="filter-select" />
                        </div>
                        <div>
                            <label>Sector Primario</label>
                            <input name="sectorPrimary" value={form.sectorPrimary} onChange={handleChange} required className="filter-select" />
                        </div>
                        <div>
                            <label>Estado Resultado</label>
                            <input name="outcomeStatus" value={form.outcomeStatus} onChange={handleChange} required className="filter-select" />
                        </div>
                        <div>
                            <label>Región</label>
                            <input name="region" value={form.region} onChange={handleChange} required className="filter-select" />
                        </div>
                    </>
                )}

                {!editingOrg && (
                    <button type="submit" disabled={loading} style={{
                        gridColumn: '1 / -1',
                        padding: '10px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '10px'
                    }}>
                        {loading ? 'Guardando...' : 'Crear Organización'}
                    </button>
                )}
            </form>
            {editingOrg && <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '1rem' }}>* En modo edición puedes actualizar coordenadas manual o vía Nominatim.</p>}
        </div>
    );
}

const actionBtnStyle = (bg) => ({
    flex: 1,
    padding: '8px',
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
});
