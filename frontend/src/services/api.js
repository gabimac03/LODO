const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Admin token for authenticated requests
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

/**
 * Generic fetch wrapper with AbortController support
 */
async function fetchWithSignal(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

/**
 * Helper to clean empty parameters
 */
function cleanParams(params) {
    const cleaned = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
            cleaned[key] = params[key];
        }
    });
    return new URLSearchParams(cleaned).toString();
}

// Public Endpoints
export const fetchOrganizations = async (params = {}, signal) => {
    const query = cleanParams(params);
    return fetchWithSignal(`${API_URL}/public/organizations?${query}`, { signal });
};

export const fetchOrganizationById = async (id, signal) => {
    return fetchWithSignal(`${API_URL}/public/organizations/${id}`, { signal });
};

export const fetchAggregates = async (params = {}, signal) => {
    const query = cleanParams(params);
    return fetchWithSignal(`${API_URL}/public/organizations/aggregates?${query}`, { signal });
};

export const fetchTaxonomies = async (signal) => {
    return fetchWithSignal(`${API_URL}/public/taxonomies`, { signal });
};

// Admin Endpoints
export const adminFetchOrganizations = async () => {
    return fetchWithSignal(`${API_URL}/organizations`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};

export const adminCreateOrganization = async (data) => {
    return fetchWithSignal(`${API_URL}/organizations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(data)
    });
};

export const adminUpdateOrganization = async (id, data) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(data)
    });
};

export const adminDeleteOrganization = async (id, force = false) => {
    return fetch(`${API_URL}/organizations/${id}${force ? '?force=true' : ''}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};

export const adminGeocodeOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/geocode`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};

export const adminSubmitForReview = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};

export const adminPublishOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};

export const adminArchiveOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/archive`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
};
