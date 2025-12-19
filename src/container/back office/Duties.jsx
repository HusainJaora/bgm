import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://13.204.161.209:8080/BURHANI_GUARDS_API_TEST/api';

const MiqaatTeamForm = () => {
    // Form state
    const [formData, setFormData] = useState({
        miqaat: null,
        jamiaat: null,
        team: null,
        location: '',
        quota: ''
    });

    // Options state
    const [miqaatOptions, setMiqaatOptions] = useState([]);
    const [jamiaatOptions, setJamiaatOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [loadingMiqaat, setLoadingMiqaat] = useState(false);
    const [loadingJamiaat, setLoadingJamiaat] = useState(false);
    const [loadingTeam, setLoadingTeam] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({});

    // Fetch Miqaat and Jamiaat on component mount - Team is dependent on Jamiaat
    useEffect(() => {
        fetchMiqaatOptions();
        fetchJamiaatOptions();
    }, []);

    // Fetch Miqaat Options
    const fetchMiqaatOptions = async () => {
        try {
            setLoadingMiqaat(true);
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/Duty/GetListOfActiveMiqaat`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const options = result.data.map(item => ({
                        value: item.miqaat_id,
                        label: item.miqaat_name
                    }));
                    setMiqaatOptions(options);
                }
            }
        } catch (error) {
            console.error('Error fetching miqaat options:', error);
        } finally {
            setLoadingMiqaat(false);
        }
    };

    // Fetch Jamiaat Options - INDEPENDENT
    const fetchJamiaatOptions = async () => {
        try {
            setLoadingJamiaat(true);
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/Team/GetAllJamiaats`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const options = result.data.map(item => ({
                        value: item.jamiaat_id,
                        label: item.jamiaat_name
                    }));
                    setJamiaatOptions(options);
                } else {
                    setJamiaatOptions([]);
                }
            }
        } catch (error) {
            console.error('Error fetching jamiaat options:', error);
            setJamiaatOptions([]);
        } finally {
            setLoadingJamiaat(false);
        }
    };

    // Fetch Team Options - DEPENDENT on Jamiaat selection
    const fetchTeamOptions = async (jamiaatId) => {
        try {
            setLoadingTeam(true);
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            // Fetch teams based on selected jamiaat
            const response = await fetch(`${API_BASE_URL}/Duty/GetTeamsByJamiaat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    jamiaat_id: jamiaatId
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const options = result.data.map(item => ({
                        value: item.team_id,
                        label: item.team_name
                    }));
                    setTeamOptions(options);
                } else {
                    setTeamOptions([]);
                }
            }
        } catch (error) {
            console.error('Error fetching team options:', error);
            setTeamOptions([]);
        } finally {
            setLoadingTeam(false);
        }
    };

    // Handle Miqaat change
    const handleMiqaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            miqaat: selectedOption
        }));
        
        if (errors.miqaat) {
            setErrors(prev => ({ ...prev, miqaat: '' }));
        }
    };

    // Handle Jamiaat change - FETCHES TEAMS based on selected Jamiaat
    const handleJamiaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            jamiaat: selectedOption,
            team: null // Reset team when jamiaat changes
        }));
        
        if (errors.jamiaat) {
            setErrors(prev => ({ ...prev, jamiaat: '' }));
        }

        // Fetch teams for the selected jamiaat
        if (selectedOption?.value) {
            fetchTeamOptions(selectedOption.value);
        } else {
            setTeamOptions([]);
        }
    };

    // Handle Team change
    const handleTeamChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            team: selectedOption
        }));
        
        if (errors.team) {
            setErrors(prev => ({ ...prev, team: '' }));
        }
    };

    // Handle Location change
    const handleLocationChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            location: value
        }));
        
        if (errors.location) {
            setErrors(prev => ({ ...prev, location: '' }));
        }
    };

    // Handle Quota change
    const handleQuotaChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            quota: value
        }));
        
        if (errors.quota) {
            setErrors(prev => ({ ...prev, quota: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.miqaat) {
            newErrors.miqaat = 'Please select a Miqaat';
        }

        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Please select a Jamiaat';
        }

        if (!formData.team) {
            newErrors.team = 'Please select a Team';
        }

        if (!formData.location || !formData.location.trim()) {
            newErrors.location = 'Please enter location';
        }

        if (!formData.quota) {
            newErrors.quota = 'Please enter quota';
        } else if (formData.quota <= 0) {
            newErrors.quota = 'Quota must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Save
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                throw new Error('Access token not found. Please login again.');
            }

            // Prepare request body for InsertDuty API
            const requestBody = {
                team_id: formData.team.value,
                miqaat_id: formData.miqaat.value,
                quota: parseInt(formData.quota),
                location: formData.location.trim()
            };

            console.log('Saving duty:', requestBody);

            const response = await fetch(`${API_BASE_URL}/Duty/InsertDuty`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            console.log('API Response:', result);
            console.log('Response Status:', response.status);
            console.log('Result Data:', result.data);

            // Handle success response
            if (response.ok) {
                // Check for result_code
                const rawcode = result.data?.result_code;
                const resultCode = Number(rawcode);
                console.log('Result Code:', resultCode);

                if (resultCode === 1) {
                    // Success
                    Swal.fire({
                        title: 'Success!',
                        text: result.message || 'Duty created successfully!',
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    });
                    
                    // Reset form after alert
                    setTimeout(() => {
                        handleClear();
                    }, 2000);
                } else if (resultCode === 4) {
                    // Duplicate - same team, miqaat, and location
                    Swal.fire({
                        icon: 'warning',
                        title: 'Duplicate Duty',
                        text: 'This duty assignment already exists (same team, miqaat, and location)',
                        confirmButtonText: 'OK'
                    });
                } else if (resultCode === 0) {
                    // Failure
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: result.message || 'Failed to create duty',
                        confirmButtonText: 'OK'
                    });
                // } else {
                //     // Unknown result code
                //     Swal.fire({
                //         icon: 'info',
                //         title: 'Notice',
                //         text: result.message || 'Duty operation completed',
                //         confirmButtonText: 'OK'
                //     });
                }
            } else {
                // Response not OK (4xx, 5xx errors)
                throw new Error(result.message || `Server error: ${response.status}`);
            }

        } catch (error) {
            console.error('Error saving duty:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle Clear
    const handleClear = () => {
        setFormData({
            miqaat: null,
            jamiaat: null,
            team: null,
            location: '',
            quota: ''
        });
        setErrors({});
        setTeamOptions([]);
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '48px',
            borderColor: state.selectProps.error ? '#dc3545' : '#dee2e6',
            borderRadius: '8px',
            borderWidth: '2px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: state.selectProps.error ? '#dc3545' : '#0d6efd'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6c757d',
            fontSize: '15px'
        }),
        singleValue: (base) => ({
            ...base,
            fontSize: '15px'
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#0d6efd',
            '&:hover': {
                color: '#0b5ed7'
            }
        })
    };

    return (
        <div className="miqaat-team-form-container">
            <style>
                {`
                    .miqaat-team-form-container {
                        background: #fff;
                        border-radius: 12px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                        max-width: 800px;
                        margin: 20px auto;
                    }

                    .form-title {
                        font-size: 22px;
                        font-weight: 600;
                        margin-bottom: 25px;
                        color: #333;
                        border-bottom: 2px solid #0d6efd;
                        padding-bottom: 12px;
                    }

                    .dropdown-row {
                        margin-bottom: 20px;
                    }

                    .dropdown-label {
                        font-weight: 500;
                        font-size: 15px;
                        color: #495057;
                        margin-bottom: 8px;
                        display: block;
                    }

                    .dropdown-label .required {
                        color: #dc3545;
                        margin-left: 4px;
                    }

                    .error-text {
                        color: #dc3545;
                        font-size: 13px;
                        margin-top: 6px;
                        display: block;
                    }

                    .two-column-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }

                    .form-input {
                        width: 100%;
                        height: 48px;
                        padding: 0 15px;
                        border: 2px solid #dee2e6;
                        border-radius: 8px;
                        font-size: 15px;
                        transition: all 0.2s;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #0d6efd;
                        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
                    }

                    .form-input.is-invalid {
                        border-color: #dc3545;
                    }

                    .save-button {
                        height: 48px;
                        padding: 0 35px;
                        background: #0d6efd;
                        border: none;
                        border-radius: 8px;
                        color: #fff;
                        font-weight: 500;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        white-space: nowrap;
                        width: 100%;
                        justify-content: center;
                        margin-top: 20px;
                    }

                    .save-button:hover:not(:disabled) {
                        background: #0b5ed7;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
                    }

                    .save-button:active:not(:disabled) {
                        transform: translateY(0);
                    }

                    .save-button:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .spinner {
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        border-top-color: #fff;
                        border-radius: 50%;
                        animation: spin 0.6s linear infinite;
                    }

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    .clear-button {
                        margin-top: 10px;
                        padding: 10px 20px;
                        background: #6c757d;
                        border: none;
                        border-radius: 8px;
                        color: #fff;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 100%;
                    }

                    .clear-button:hover:not(:disabled) {
                        background: #5c636a;
                    }

                    .clear-button:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    /* Responsive Design */
                    @media (max-width: 768px) {
                        .miqaat-team-form-container {
                            padding: 20px;
                        }

                        .two-column-row {
                            grid-template-columns: 1fr;
                            gap: 15px;
                        }
                    }
                `}
            </style>

            <div className="form-title">
                <i className="ri-file-list-3-line me-2"></i>
                Duties Assign
            </div>

            {/* Row 1: Miqaat Dropdown */}
            <div className="dropdown-row">
                <label className="dropdown-label">
                    Miqaat <span className="required">*</span>
                </label>
                <Select
                    options={miqaatOptions}
                    value={formData.miqaat}
                    onChange={handleMiqaatChange}
                    placeholder="Select Miqaat"
                    isClearable
                    styles={selectStyles}
                    error={errors.miqaat}
                    isDisabled={loading}
                    isLoading={loadingMiqaat}
                />
                {errors.miqaat && <span className="error-text">{errors.miqaat}</span>}
            </div>

            {/* Row 2: Jamiaat and Team */}
            <div className="two-column-row">
                <div>
                    <label className="dropdown-label">
                        Jamiaat <span className="required">*</span>
                    </label>
                    <Select
                        options={jamiaatOptions}
                        value={formData.jamiaat}
                        onChange={handleJamiaatChange}
                        placeholder={loadingJamiaat ? "Loading..." : "Select Jamiaat"}
                        isClearable
                        styles={selectStyles}
                        error={errors.jamiaat}
                        isDisabled={loading}
                        isLoading={loadingJamiaat}
                    />
                    {errors.jamiaat && <span className="error-text">{errors.jamiaat}</span>}
                </div>

                <div>
                    <label className="dropdown-label">
                        Team <span className="required">*</span>
                    </label>
                    <Select
                        options={teamOptions}
                        value={formData.team}
                        onChange={handleTeamChange}
                        placeholder={loadingTeam ? "Loading..." : "Select Team"}
                        isClearable
                        styles={selectStyles}
                        error={errors.team}
                        isDisabled={loading || loadingTeam || !formData.jamiaat}
                        isLoading={loadingTeam}
                        noOptionsMessage={() => formData.jamiaat ? "No teams found" : "Please select Jamiaat first"}
                    />
                    {errors.team && <span className="error-text">{errors.team}</span>}
                </div>
            </div>

            {/* Row 3: Location and Quota */}
            <div className="two-column-row">
                <div>
                    <label className="dropdown-label">
                        Location <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        className={`form-input ${errors.location ? 'is-invalid' : ''}`}
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={handleLocationChange}
                        disabled={loading}
                    />
                    {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div>
                    <label className="dropdown-label">
                        Quota <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        className={`form-input ${errors.quota ? 'is-invalid' : ''}`}
                        placeholder="Enter quota"
                        value={formData.quota}
                        onChange={handleQuotaChange}
                        disabled={loading}
                        min="1"
                    />
                    {errors.quota && <span className="error-text">{errors.quota}</span>}
                </div>
            </div>

            {/* Save Button */}
            <button 
                className="save-button"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Saving...
                    </>
                ) : (
                    <>
                        <i className="ri-save-line"></i>
                        Save
                    </>
                )}
            </button>

            {/* Clear Button */}
            <button 
                className="clear-button"
                onClick={handleClear}
                disabled={loading}
            >
                <i className="ri-refresh-line me-2"></i>
                Clear Form
            </button>
        </div>
    );
};

export default MiqaatTeamForm;