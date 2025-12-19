import React, { Fragment, useState, useEffect, useMemo} from 'react';
import { Grid } from 'gridjs-react';
import { html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { Card, Row, Col } from 'react-bootstrap';
import IconButton from '../../elements/button'; 
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
 
import ConfirmDeleteModal from '../../../components/common/modalcloses/confirmdelete';


const API_BASE_URL = 'http://13.204.161.209:8080/BURHANI_GUARDS_API_TEST/api';


const AddMiqaat = ({ 
    show, 
    onClose, 
    onSave,
    editData = null,
    title = "Add New Miqaat"
}) => {
    
    // Form state
    const [formData, setFormData] = useState({
        miqaatName: '',
        miqaatType: null,
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        reportingDate: '',
        reportingTime: '',
        venue: '',
        jamaat: null,
        jamiaat: null,
        quantity: '',
        isActive: true
    });

    // Options state
    const [miqaatTypeOptions, setMiqaatTypeOptions] = useState([]);
    const [jamiaatOptions, setJamiaatOptions] = useState([]);
    const [jamaatOptions, setJamaatOptions] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [loadingJamaat, setLoadingJamaat] = useState(false);
    const [errors, setErrors] = useState({});

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get current time in HH:MM format
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    // Auto-close success alert using SweetAlert2
    const showSuccessAlert = (message) => {
    Swal.fire({
        title: 'Success!',
        text: `${message}`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: false,
        showConfirmButton: false,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            handleClose();
        }
    });
};


    // Fetch Miqaat Types on component mount
    useEffect(() => {
        if (show) {
            fetchMiqaatTypes();
            fetchJamiaat();
        }
    }, [show]);

    // Fetch Miqaat Types
    const fetchMiqaatTypes = async () => {
        try {
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/Miqaat/GetAllMiqaatTypes`, {
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
                        value: item.miqaat_type_id,
                        label: item.miqaat_type_name
                    }));
                    setMiqaatTypeOptions(options);
                }
            }
        } catch (error) {
            console.error('Error fetching miqaat types:', error);
        }
    };

    // Fetch Jamiaat
    const fetchJamiaat = async () => {
        try {
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
                }
            }
        } catch (error) {
            console.error('Error fetching jamiaat:', error);
        }
    };

    // Fetch Jamaat based on selected Jamiaat
    const fetchJamaatByJamiaat = async (jamiaatId) => {
        try {
            setLoadingJamaat(true);
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            const requestBody = {
                jamiaat_id: jamiaatId
            };

            const response = await fetch(`${API_BASE_URL}/Miqaat/GetJamaatsByJamiaat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const options = result.data.map(item => ({
                        value: item.jamaat_id,
                        label: item.jamaat_name
                    }));
                    setJamaatOptions(options);
                } else {
                    setJamaatOptions([]);
                }
            } else {
                console.error('Failed to fetch jamaat:', response.status);
                setJamaatOptions([]);
            }
        } catch (error) {
            console.error('Error fetching jamaat:', error);
            setJamaatOptions([]);
        } finally {
            setLoadingJamaat(false);
        }
    };

    // Handle Jamiaat change - fetch related Jamaat
    const handleJamiaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            jamiaat: selectedOption,
            jamaat: null // Reset jamaat when jamiaat changes
        }));
        
        if (errors.jamiaat) {
            setErrors(prev => ({ ...prev, jamiaat: '' }));
        }

        // Fetch jamaat for selected jamiaat
        if (selectedOption) {
            fetchJamaatByJamiaat(selectedOption.value);
        } else {
            setJamaatOptions([]);
        }
    };

    // Populate form when editing
    useEffect(() => {
        if (editData) {
            setFormData({
                miqaatName: editData.miqaatName || '',
                miqaatType: editData.miqaatTypeId ? 
                    { value: editData.miqaatTypeId, label: editData.miqaatType } 
                    : null,
                startDate: editData.startDate || '',
                startTime: editData.startTime || '',
                endDate: editData.endDate || '',
                endTime: editData.endTime || '',
                reportingDate: editData.reportingDate || '',
                reportingTime: editData.reportingTime || '',
                venue: editData.venue || '',
                jamaat: editData.jamaatId ? 
                    { value: editData.jamaatId, label: editData.jamaat }
                    : null,
                jamiaat: editData.jamiaatId ? 
                    { value: editData.jamiaatId, label: editData.jamiaat }
                    : null,
                quantity: editData.quantity || '',
                isActive: editData.isActive !== undefined ? editData.isActive : true
            });
            setErrors({});
        } else {
            handleClear();
        }
    }, [editData, show]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle Select changes
    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        const today = getTodayDate();
        const currentTime = getCurrentTime();

        // Miqaat Name validation
        if (!formData.miqaatName.trim()) {
            newErrors.miqaatName = 'Miqaat Name is required';
        }

        // Miqaat Type validation
        if (!formData.miqaatType) {
            newErrors.miqaatType = 'Miqaat Type is required';
        }

        // Start Date validation
        if (!formData.startDate) {
            newErrors.startDate = 'Start Date is required';
        } else if (formData.startDate < today) {
            newErrors.startDate = 'Start Date cannot be in the past';
        }

        // Start Time validation
        if (!formData.startTime) {
            newErrors.startTime = 'Start Time is required';
        } else if (formData.startDate === today && formData.startTime < currentTime) {
            newErrors.startTime = 'Start Time cannot be in the past for today';
        }

        // End Date validation
        if (!formData.endDate) {
            newErrors.endDate = 'End Date is required';
        } else if (formData.endDate < formData.startDate) {
            newErrors.endDate = 'End Date cannot be before Start Date';
        }

        // End Time validation
        if (!formData.endTime) {
            newErrors.endTime = 'End Time is required';
        } else if (formData.endDate === formData.startDate && formData.endTime <= formData.startTime) {
            newErrors.endTime = 'End Time must be after Start Time on the same day';
        }

        // Reporting Date validation
        // if (!formData.reportingDate) {
        //     newErrors.reportingDate = 'Reporting Date is required';
        // } else if (formData.reportingDate < today) {
        //     newErrors.reportingDate = 'Reporting Date cannot be in the past';
        // } else if (formData.reportingDate > formData.startDate) {
        //     newErrors.reportingDate = 'Reporting Date cannot be after Start Date';
        // }
        // Reporting Date validation
if (!formData.reportingDate) {
    newErrors.reportingDate = 'Reporting Date is required';
} else if (formData.reportingDate < today) {
    newErrors.reportingDate = 'Reporting Date cannot be in the past';
} else if (formData.reportingDate < formData.startDate) {  // ✅ Changed from >
    newErrors.reportingDate = 'Reporting Date cannot be before Start Date';
} else if (formData.reportingDate > formData.endDate) {  // ✅ Added this check
    newErrors.reportingDate = 'Reporting Date cannot be after End Date';
}

// Reporting Time validation
if (!formData.reportingTime) {
    newErrors.reportingTime = 'Reporting Time is required';
} else if (formData.reportingDate === today && formData.reportingTime < currentTime) {
    newErrors.reportingTime = 'Reporting Time cannot be in the past for today';
} 
// else if (formData.reportingDate === formData.startDate && formData.reportingTime < formData.startTime) {  // ✅ Changed from >=
//     newErrors.reportingTime = 'Reporting Time must be at or after Start Time on the same day';
// } 
else if (formData.reportingDate === formData.endDate && formData.reportingTime > formData.endTime) {  // ✅ Added this check
    newErrors.reportingTime = 'Reporting Time cannot be after End Time on the same day';
}

        

        // Venue validation
        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }

        // Jamiaat validation
        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Jamiaat is required';
        }

        // Jamaat validation
        if (!formData.jamaat) {
            newErrors.jamaat = 'Jamaat is required';
        }

        // Quantity validation
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
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

            // Combine date and time for start_date, end_date, and reporting_date
            const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
            const reportingDateTime = `${formData.reportingDate}T${formData.reportingTime}:00`;

            const requestBody = {
                miqaat_name: formData.miqaatName,
                miqaat_type_id: formData.miqaatType.value,
                start_date: startDateTime,
                end_date: endDateTime,
                reporting_time: reportingDateTime,
                venue: formData.venue,
                jamaat_id: formData.jamaat.value,
                jamiaat_id: formData.jamiaat.value,
                quantity: parseInt(formData.quantity),
                is_active: formData.isActive
            };

            console.log('Sending request:', requestBody);

            const response = await fetch(`${API_BASE_URL}/Miqaat/InsertMiqaat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Call onSave callback before showing alert
                if (onSave) {
                    onSave(result.data);
                }

                // Show auto-close success alert
                showSuccessAlert(result.message || 'Miqaat added successfully!');
            } else {
                // Handle error response
                if (result.data && result.data.result_code === 4) {
                    setErrors({ miqaatName: 'Miqaat name already exists' });
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Miqaat name already exists',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(result.message || 'Failed to add miqaat');
                }
            }
        } catch (error) {
            console.error('Error saving miqaat:', error);
            setErrors({ submit: error.message });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving the miqaat',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle Close
    const handleClose = () => {
        handleClear();
        if (onClose) {
            onClose();
        }
    };

    // Handle Clear
    const handleClear = () => {
        setFormData({
            miqaatName: '',
            miqaatType: null,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            reportingDate: '',
            reportingTime: '',
            venue: '',
            jamaat: null,
            jamiaat: null,
            quantity: '',
            isActive: true
        });
        setErrors({});
        setJamaatOptions([]);
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '38px',
            borderColor: state.selectProps.error ? '#dc3545' : '#dee2e6',
            '&:hover': {
                borderColor: state.selectProps.error ? '#dc3545' : '#86b7fe'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6c757d'
        })
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <style>
                {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1050;
                        animation: fadeIn 0.2s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .modal-form-container {
                        background: #fff;
                        border-radius: 12px;
                        padding: 25px;
                        width: 90%;
                        max-width: 900px;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                        animation: slideIn 0.3s ease;
                        position: relative;
                    }

                    .modal-form-container .form-title {
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #333;
                        border-bottom: 2px solid #0d6efd;
                        padding-bottom: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .modal-form-container .form-title .close-btn {
                        background: none;
                        border: none;
                        font-size: 24px;
                        color: #666;
                        cursor: pointer;
                        padding: 0;
                        line-height: 1;
                        transition: color 0.2s;
                    }

                    .modal-form-container .form-title .close-btn:hover {
                        color: #dc3545;
                    }

                    .modal-form-container .form-buttons {
                        display: flex;
                        gap: 10px;
                        margin-top: 25px;
                        justify-content: center;
                        padding-top: 15px;
                        border-top: 1px solid #e9ecef;
                    }

                    .horizontal-form-group {
                        display: flex;
                        align-items: flex-start;
                    }
                    .horizontal-form-group .form-label {
                        min-width: 120px;
                        margin-bottom: 0;
                        margin-right: 10px;
                        font-weight: 500;
                        text-align: right;
                        white-space: nowrap;
                        padding-top: 8px;
                    }
                    .horizontal-form-group .form-input-wrapper {
                        flex: 1;
                    }

                    .form-row-inline {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    .form-row-inline .horizontal-form-group {
                        flex: 1;
                    }

                    .datetime-row {
                        display: flex;
                        gap: 10px;
                    }
                    .datetime-row .date-input {
                        flex: 1.5;
                    }
                    .datetime-row .time-input {
                        flex: 1;
                    }

                    .error-text {
                        color: #dc3545;
                        font-size: 12px;
                        margin-top: 4px;
                    }

                    .submit-error {
                        background: #f8d7da;
                        border: 1px solid #f5c2c7;
                        border-radius: 6px;
                        padding: 12px;
                        margin-bottom: 15px;
                        color: #842029;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .form-control.is-invalid {
                        border-color: #dc3545;
                    }

                    .checkbox-wrapper {
                        display: flex;
                        align-items: center;
                        padding-top: 8px;
                    }
                    .checkbox-wrapper .form-check {
                        margin-bottom: 0;
                    }
                    .checkbox-wrapper .form-check-input {
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                    }
                    .checkbox-wrapper .form-check-label {
                        cursor: pointer;
                        margin-left: 5px;
                    }

                    .btn-clear {
                        background-color: #6c757d !important;
                        border-color: #6c757d !important;
                        color: #fff !important;
                    }
                    .btn-clear:hover {
                        background-color: #5c636a !important;
                        border-color: #565e64 !important;
                    }

                    .btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .loading-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255, 255, 255, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 12px;
                        z-index: 10;
                    }

                    .spinner-border {
                        width: 3rem;
                        height: 3rem;
                        border-width: 0.3em;
                    }
                `}
            </style>

            <div className="modal-form-container" onClick={(e) => e.stopPropagation()}>
                {/* Loading Overlay */}
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <div className="form-title">
                    <span>
                        <i className={`ri-${editData ? 'edit' : 'add-circle'}-line me-2`}></i>
                        {editData ? 'Edit Miqaat' : title}
                    </span>
                    <button className="close-btn" onClick={handleClose} title="Close" disabled={loading}>
                        &times;
                    </button>
                </div>
                
                {/* Submit Error */}
                {errors.submit && (
                    <div className="submit-error">
                        <i className="ri-error-warning-line"></i>
                        <span>{errors.submit}</span>
                    </div>
                )}

                {/* Row 1: Miqaat Name and Miqaat Type */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Miqaat Name <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control
                                type="text"
                                name="miqaatName"
                                value={formData.miqaatName}
                                onChange={handleInputChange}
                                placeholder="Enter Miqaat Name"
                                className={errors.miqaatName ? 'is-invalid' : ''}
                                disabled={loading}
                            />
                            {errors.miqaatName && <div className="error-text">{errors.miqaatName}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>Miqaat Type <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={miqaatTypeOptions}
                                value={formData.miqaatType}
                                onChange={(option) => handleSelectChange('miqaatType', option)}
                                placeholder="Select Miqaat Type"
                                isClearable
                                styles={selectStyles}
                                error={errors.miqaatType}
                                isDisabled={loading}
                            />
                            {errors.miqaatType && <div className="error-text">{errors.miqaatType}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 2: Start Date & Time and End Date & Time in one line */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Start Date & Time <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <div className="datetime-row">
                                <div className="date-input">
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        min={getTodayDate()}
                                        className={errors.startDate ? 'is-invalid' : ''}
                                        disabled={loading}
                                    />
                                    {errors.startDate && <div className="error-text">{errors.startDate}</div>}
                                </div>
                                <div className="time-input">
                                    <Form.Control
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className={errors.startTime ? 'is-invalid' : ''}
                                        disabled={loading}
                                        step="300"
                                    />
                                    {errors.startTime && <div className="error-text">{errors.startTime}</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>End Date & Time <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <div className="datetime-row">
                                <div className="date-input">
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate || getTodayDate()}
                                        className={errors.endDate ? 'is-invalid' : ''}
                                        disabled={loading}
                                    />
                                    {errors.endDate && <div className="error-text">{errors.endDate}</div>}
                                </div>
                                <div className="time-input">
                                    <Form.Control
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className={errors.endTime ? 'is-invalid' : ''}
                                        disabled={loading}
                                        step="300"
                                    />
                                    {errors.endTime && <div className="error-text">{errors.endTime}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Reporting Date & Time and Venue in one line */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Reporting Date & Time <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <div className="datetime-row">
                                <div className="date-input">
                                    <Form.Control
                                        type="date"
                                        name="reportingDate"
                                        value={formData.reportingDate}
                                        onChange={handleInputChange}
                                        min={getTodayDate()}
                                        max={formData.endDate || undefined}
                                        className={errors.reportingDate ? 'is-invalid' : ''}
                                        disabled={loading}
                                    />
                                    {errors.reportingDate && <div className="error-text">{errors.reportingDate}</div>}
                                </div>
                                <div className="time-input">
                                    <Form.Control
                                        type="time"
                                        name="reportingTime"
                                        value={formData.reportingTime}
                                        onChange={handleInputChange}
                                        className={errors.reportingTime ? 'is-invalid' : ''}
                                        disabled={loading}
                                        step="300"
                                    />
                                    {errors.reportingTime && <div className="error-text">{errors.reportingTime}</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>Venue <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                                placeholder="Enter Venue"
                                className={errors.venue ? 'is-invalid' : ''}
                                disabled={loading}
                            />
                            {errors.venue && <div className="error-text">{errors.venue}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 4: Jamiaat and Jamaat */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Jamiaat <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={jamiaatOptions}
                                value={formData.jamiaat}
                                onChange={handleJamiaatChange}
                                placeholder="Select Jamiaat"
                                isClearable
                                styles={selectStyles}
                                error={errors.jamiaat}
                                isDisabled={loading}
                            />
                            {errors.jamiaat && <div className="error-text">{errors.jamiaat}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>Jamaat <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={jamaatOptions}
                                value={formData.jamaat}
                                onChange={(option) => handleSelectChange('jamaat', option)}
                                placeholder={loadingJamaat ? "Loading..." : "Select Jamaat"}
                                isClearable
                                styles={selectStyles}
                                error={errors.jamaat}
                                isDisabled={loading || loadingJamaat || !formData.jamiaat}
                                noOptionsMessage={() => formData.jamiaat ? "No jamaat found" : "Please select Jamiaat first"}
                            />
                            {errors.jamaat && <div className="error-text">{errors.jamaat}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 5: Quantity and Is Active */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="Enter Quantity"
                                min="1"
                                className={errors.quantity ? 'is-invalid' : ''}
                                disabled={loading}
                            />
                            {errors.quantity && <div className="error-text">{errors.quantity}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label></Form.Label>
                        <div className="form-input-wrapper">
                            <div className="checkbox-wrapper">
                                <Form.Check
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    label="Active"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-buttons">
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        <i className="ri-save-line me-1"></i> {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        <i className="ri-arrow-left-line me-1"></i> Back
                    </Button>
                    <Button className="btn-clear" onClick={handleClear} disabled={loading}>
                        <i className="ri-refresh-line me-1"></i> Clear
                    </Button>
                </div>
            </div>
        </div>
    );
};

const EditMiqaat = ({ 
    show, 
    onClose, 
    onUpdate, 
    miqaatId,
    title = "Edit Miqaat"
}) => {
    
    // Form state
    const [formData, setFormData] = useState({
        miqaatName: '',
        miqaatType: null,
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        reportingDate: '',
        reportingTime: '',
        venue: '',
        jamaat: null,
        jamiaat: null,
        quantity: '',
        isActive: true
    });

    // Validation errors state
    const [errors, setErrors] = useState({});

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMiqaatData, setIsLoadingMiqaatData] = useState(false);
    const [isLoadingMiqaatTypes, setIsLoadingMiqaatTypes] = useState(false);
    const [isLoadingJamiaats, setIsLoadingJamiaats] = useState(false);
    const [isLoadingJamaats, setIsLoadingJamaats] = useState(false);

    // Options state
    const [miqaatTypeOptions, setMiqaatTypeOptions] = useState([]);
    const [jamiaatOptions, setJamiaatOptions] = useState([]);
    const [jamaatOptions, setJamaatOptions] = useState([]);

    // Original data for comparison
    const [originalData, setOriginalData] = useState(null);

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get current time in HH:MM format
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    // Auto-close success alert using SweetAlert2
    const showSuccessAlert = (message) => {
        Swal.fire({
            title: 'Success!',
            text: `${message}`,
            icon: 'success',
            timer: 2000,
            timerProgressBar: false,
            showConfirmButton: false,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                handleClose();
            }
        });
    };

    // Fetch miqaat data by ID when component shows
    useEffect(() => {
        if (show && miqaatId) {
            fetchMiqaatData(miqaatId);
            fetchMiqaatTypes();
            fetchAllJamiaats();
        }
    }, [show, miqaatId]);
 
    // Fetch Miqaat Data by ID
const fetchMiqaatData = async (id) => {
    setIsLoadingMiqaatData(true);
    try {
        const token = sessionStorage.getItem('access_token');
        
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Authentication token not found. Please login again.',
                confirmButtonText: 'OK'
            });
            setIsLoadingMiqaatData(false);
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/Miqaat/GetMiqaatById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                miqaat_id: id
            })
        });

        const result = await response.json();
        console.log('API Response:', result);

        if (response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Please login again.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (response.ok && result.success && result.data && result.data.length > 0) {
            const miqaatData = result.data[0];
            
            console.log('Fetched Miqaat Data:', miqaatData);
            
            // Parse datetime strings
            const startDateTime = new Date(miqaatData.start_date);
            const endDateTime = new Date(miqaatData.end_date);
            
            // Handle reporting_time - the API field is reporting_time, not reporting_date
            let reportingDateValue = '';
            let reportingTimeValue = '';
            
            if (miqaatData.reporting_time) {
                const reportingDateTime = new Date(miqaatData.reporting_time);
                reportingDateValue = reportingDateTime.toISOString().split('T')[0];
                reportingTimeValue = reportingDateTime.toTimeString().slice(0, 5);
            }

            // Miqaat Type
            const miqaatTypeObj = miqaatData.miqaat_type_id ? {
                value: miqaatData.miqaat_type_id,
                label: miqaatData.miqaat_type_name
            } : null;

            // Jamiaat - handle if missing
            const jamiaatObj = miqaatData.jamiaat_id ? {
                value: miqaatData.jamiaat_id,
                label: miqaatData.jamiaat_name
            } : null;

            // Jamaat - handle if missing
            const jamaatObj = miqaatData.jamaat_id ? {
                value: miqaatData.jamaat_id,
                label: miqaatData.jamaat_name
            } : null;

            const initialFormData = {
                miqaatName: miqaatData.miqaat_name || '',
                miqaatType: miqaatTypeObj,
                startDate: startDateTime.toISOString().split('T')[0],
                startTime: startDateTime.toTimeString().slice(0, 5),
                endDate: endDateTime.toISOString().split('T')[0],
                endTime: endDateTime.toTimeString().slice(0, 5),
                reportingDate: reportingDateValue,
                reportingTime: reportingTimeValue,
                venue: miqaatData.venue || '',
                jamaat: jamaatObj,
                jamiaat: jamiaatObj,
                quantity: miqaatData.quantity?.toString() || '',
                isActive: miqaatData.is_active !== undefined ? miqaatData.is_active : true
            };

            console.log('Initial Form Data:', initialFormData);
            
            setFormData(initialFormData);
            setOriginalData(initialFormData);

            // Fetch jamaats for the selected jamiaat
            if (miqaatData.jamiaat_id) {
                await fetchJamaatsByJamiaat(miqaatData.jamiaat_id);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Failed to load miqaat data',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error fetching miqaat data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error loading miqaat data. Please try again.',
            confirmButtonText: 'OK'
        });
    } finally {
        setIsLoadingMiqaatData(false);
    }
};  

    // Fetch all Miqaat Types
    const fetchMiqaatTypes = async () => {
        setIsLoadingMiqaatTypes(true);
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                console.error('Authentication token not found');
                setIsLoadingMiqaatTypes(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Miqaat/GetAllMiqaatTypes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.status === 401) {
                console.error('Session expired');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.miqaat_type_id,
                    label: item.miqaat_type_name
                }));
                setMiqaatTypeOptions(options);
            }
        } catch (error) {
            console.error('Error fetching Miqaat Types:', error);
        } finally {
            setIsLoadingMiqaatTypes(false);
        }
    };

    // Fetch all Jamiaats
    const fetchAllJamiaats = async () => {
        setIsLoadingJamiaats(true);
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                console.error('Authentication token not found');
                setIsLoadingJamiaats(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Team/GetAllJamiaats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.status === 401) {
                console.error('Session expired');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamiaat_id,
                    label: item.jamiaat_name
                }));
                setJamiaatOptions(options);
            }
        } catch (error) {
            console.error('Error fetching Jamiaats:', error);
        } finally {
            setIsLoadingJamiaats(false);
        }
    };

    // Fetch Jamaats based on selected Jamiaat
    const fetchJamaatsByJamiaat = async (jamiaatId) => {
        setIsLoadingJamaats(true);
        
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                console.error('Authentication token not found');
                setIsLoadingJamaats(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Miqaat/GetJamaatsByJamiaat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jamiaat_id: jamiaatId
                })
            });

            const result = await response.json();

            if (response.status === 401) {
                console.error('Session expired');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamaat_id,
                    label: item.jamaat_name
                }));
                setJamaatOptions(options);
            } else {
                setJamaatOptions([]);
            }
        } catch (error) {
            console.error('Error fetching Jamaats:', error);
            setJamaatOptions([]);
        } finally {
            setIsLoadingJamaats(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle Select changes
    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle Jamiaat select change
    const handleJamiaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            jamiaat: selectedOption,
            jamaat: null // Clear jamaat when jamiaat changes
        }));
        
        if (errors.jamiaat) {
            setErrors(prev => ({
                ...prev,
                jamiaat: ''
            }));
        }
        
        if (selectedOption?.value) {
            fetchJamaatsByJamiaat(selectedOption.value);
        } else {
            setJamaatOptions([]);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        const today = getTodayDate();
        const currentTime = getCurrentTime();

        // Miqaat Name validation
        if (!formData.miqaatName.trim()) {
            newErrors.miqaatName = 'Miqaat Name is required';
        }

        // Miqaat Type validation
        if (!formData.miqaatType) {
            newErrors.miqaatType = 'Miqaat Type is required';
        }

        // Start Date validation
        if (!formData.startDate) {
            newErrors.startDate = 'Start Date is required';
        } else if (formData.startDate < today) {
            newErrors.startDate = 'Start Date cannot be in the past';
        }

        // Start Time validation
        if (!formData.startTime) {
            newErrors.startTime = 'Start Time is required';
        } else if (formData.startDate === today && formData.startTime < currentTime) {
            newErrors.startTime = 'Start Time cannot be in the past for today';
        }

        // End Date validation
        if (!formData.endDate) {
            newErrors.endDate = 'End Date is required';
        } else if (formData.endDate < formData.startDate) {
            newErrors.endDate = 'End Date cannot be before Start Date';
        }

        // End Time validation
        if (!formData.endTime) {
            newErrors.endTime = 'End Time is required';
        } else if (formData.endDate === formData.startDate && formData.endTime <= formData.startTime) {
            newErrors.endTime = 'End Time must be after Start Time on the same day';
        }

        // Reporting Date validation
        // if (!formData.reportingDate) {
        //     newErrors.reportingDate = 'Reporting Date is required';
        // } else if (formData.reportingDate < today) {
        //     newErrors.reportingDate = 'Reporting Date cannot be in the past';
        // } else if (formData.reportingDate > formData.startDate) {
        //     newErrors.reportingDate = 'Reporting Date cannot be after Start Date';
        // }

        // // Reporting Time validation
        // if (!formData.reportingTime) {
        //     newErrors.reportingTime = 'Reporting Time is required';
        // } else if (formData.reportingDate === today && formData.reportingTime < currentTime) {
        //     newErrors.reportingTime = 'Reporting Time cannot be in the past for today';
        // } else if (formData.reportingDate === formData.startDate && formData.reportingTime >= formData.startTime) {
        //     newErrors.reportingTime = 'Reporting Time must be before Start Time on the same day';
        // }


        // Reporting Date validation    reporting date and time 
if (!formData.reportingDate) {
    newErrors.reportingDate = 'Reporting Date is required';
} else if (formData.reportingDate < today) {
    newErrors.reportingDate = 'Reporting Date cannot be in the past';
} else if (formData.reportingDate < formData.startDate) {  // ✅ Changed from >
    newErrors.reportingDate = 'Reporting Date cannot be before Start Date';
} else if (formData.reportingDate > formData.endDate) {  // ✅ Added this check
    newErrors.reportingDate = 'Reporting Date cannot be after End Date';
}

// Reporting Time validation           
if (!formData.reportingTime) {
    newErrors.reportingTime = 'Reporting Time is required';
} else if (formData.reportingDate === today && formData.reportingTime < currentTime) {
    newErrors.reportingTime = 'Reporting Time cannot be in the past for today';
} 
// else if (formData.reportingDate === formData.startDate && formData.reportingTime < formData.startTime) {  // ✅ Changed from >=
//     newErrors.reportingTime = 'Reporting Time must be at or after Start Time on the same day';
// } 
else if (formData.reportingDate === formData.endDate && formData.reportingTime > formData.endTime) {  // ✅ Added this check
    newErrors.reportingTime = 'Reporting Time cannot be after End Time on the same day';
}

        // Venue validation
        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }

        // Jamiaat validation
        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Jamiaat is required';
        }

        // Jamaat validation
        if (!formData.jamaat) {
            newErrors.jamaat = 'Jamaat is required';
        }

        // Quantity validation
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if form has changes
    const hasChanges = () => {
        if (!originalData) return false;

        return (
            formData.miqaatName !== originalData.miqaatName ||
            formData.miqaatType?.value !== originalData.miqaatType?.value ||
            formData.startDate !== originalData.startDate ||
            formData.startTime !== originalData.startTime ||
            formData.endDate !== originalData.endDate ||
            formData.endTime !== originalData.endTime ||
            formData.reportingDate !== originalData.reportingDate ||
            formData.reportingTime !== originalData.reportingTime ||
            formData.venue !== originalData.venue ||
            formData.jamaat?.value !== originalData.jamaat?.value ||
            formData.jamiaat?.value !== originalData.jamiaat?.value ||
            formData.quantity !== originalData.quantity ||
            formData.isActive !== originalData.isActive
        );
    };

    // Handle Update using PUT API
    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        if (!hasChanges()) {
            Swal.fire({
                icon: 'info',
                title: 'No Changes',
                text: 'No changes to update',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('access_token');

            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Authentication token not found. Please login again.',
                    confirmButtonText: 'OK'
                });
                setIsLoading(false);
                return;
            }

            // Combine date and time for start_date, end_date, and reporting_date
            const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
            const reportingDateTime = `${formData.reportingDate}T${formData.reportingTime}:00`;

            const payload = {
                miqaat_id: miqaatId,
                miqaat_name: formData.miqaatName.trim(),
                miqaat_type_id: formData.miqaatType.value,
                start_date: startDateTime,
                end_date: endDateTime,
                reporting_time: reportingDateTime,
                venue: formData.venue.trim(),
                jamaat_id: formData.jamaat.value,
                jamiaat_id: formData.jamiaat.value,
                quantity: parseInt(formData.quantity),
                is_active: formData.isActive
            };

            console.log('Sending update request:', payload);

            const response = await fetch(`${API_BASE_URL}/Miqaat/UpdateMiqaat`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Please login again.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            if (response.ok && result.success) {
                // Call onUpdate callback before showing alert
                if (onUpdate) {
                    const dataToUpdate = {
                        miqaat_id: miqaatId,
                        miqaat_name: formData.miqaatName,
                        miqaat_type_id: formData.miqaatType.value,
                        miqaat_type_name: formData.miqaatType.label,
                        start_date: startDateTime,
                        end_date: endDateTime,
                        reporting_time: reportingDateTime,
                        venue: formData.venue,
                        jamaat_id: formData.jamaat.value,
                        jamaat_name: formData.jamaat.label,
                        jamiaat_id: formData.jamiaat.value,
                        jamiaat_name: formData.jamiaat.label,
                        quantity: parseInt(formData.quantity),
                        is_active: formData.isActive
                    };
                    onUpdate(dataToUpdate);
                }
                
                // Show auto-close success alert
                showSuccessAlert(result.message || 'Miqaat updated successfully!');
            } else {
                if (result.data?.result_code === 4) {
                    setErrors(prev => ({
                        ...prev,
                        miqaatName: 'Miqaat name already exists'
                    }));
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Miqaat name already exists',
                        confirmButtonText: 'OK'
                    });
                } else if (result.data?.result_code === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Miqaat not found or update failed',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message || 'Failed to update miqaat',
                        confirmButtonText: 'OK'
                    });
                }
            }
        } catch (error) {
            console.error('Error updating miqaat:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the miqaat. Please try again.',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Close
    const handleClose = () => {
        setFormData({
            miqaatName: '',
            miqaatType: null,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            reportingDate: '',
            reportingTime: '',
            venue: '',
            jamaat: null,
            jamiaat: null,
            quantity: '',
            isActive: true
        });
        setErrors({});
        setOriginalData(null);
        setJamaatOptions([]);
        
        if (onClose) {
            onClose();
        }
    };

    // Handle Reset
    const handleReset = () => {
        if (originalData) {
            setFormData({ ...originalData });
            setErrors({});
            Swal.fire({
                icon: 'info',
                title: 'Form Reset',
                text: 'Form reset to original values',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '38px',
            borderColor: state.selectProps.error ? '#dc3545' : '#dee2e6',
            '&:hover': {
                borderColor: state.selectProps.error ? '#dc3545' : '#86b7fe'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6c757d'
        })
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <style>
                {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1050;
                        animation: fadeIn 0.2s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .modal-form-container {
                        background: #fff;
                        border-radius: 12px;
                        padding: 25px;
                        width: 90%;
                        max-width: 900px;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                        animation: slideIn 0.3s ease;
                        position: relative;
                    }

                    .modal-form-container .form-title {
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #333;
                        border-bottom: 2px solid #0d6efd;
                        padding-bottom: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .modal-form-container .form-title .close-btn {
                        background: none;
                        border: none;
                        font-size: 24px;
                        color: #666;
                        cursor: pointer;
                        padding: 0;
                        line-height: 1;
                        transition: color 0.2s;
                    }

                    .modal-form-container .form-title .close-btn:hover {
                        color: #dc3545;
                    }

                    .modal-form-container .form-buttons {
                        display: flex;
                        gap: 10px;
                        margin-top: 25px;
                        justify-content: center;
                        padding-top: 15px;
                        border-top: 1px solid #e9ecef;
                    }

                    .horizontal-form-group {
                        display: flex;
                        align-items: flex-start;
                    }
                    .horizontal-form-group .form-label {
                        min-width: 120px;
                        margin-bottom: 0;
                        margin-right: 10px;
                        font-weight: 500;
                        text-align: right;
                        white-space: nowrap;
                        padding-top: 8px;
                    }
                    .horizontal-form-group .form-input-wrapper {
                        flex: 1;
                    }

                    .form-row-inline {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    .form-row-inline .horizontal-form-group {
                        flex: 1;
                    }

                    .datetime-row {
                        display: flex;
                        gap: 10px;
                    }
                    .datetime-row .date-input {
                        flex: 1.5;
                    }
                    .datetime-row .time-input {
                        flex: 1;
                    }

                    .error-text {
                        color: #dc3545;
                        font-size: 12px;
                        margin-top: 4px;
                    }

                    .form-control.is-invalid {
                        border-color: #dc3545;
                    }

                    .checkbox-wrapper {
                        display: flex;
                        align-items: center;
                        padding-top: 8px;
                    }
                    .checkbox-wrapper .form-check {
                        margin-bottom: 0;
                    }
                    .checkbox-wrapper .form-check-input {
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                    }
                    .checkbox-wrapper .form-check-label {
                        cursor: pointer;
                        margin-left: 5px;
                    }

                    .btn-reset {
                        background-color: #6c757d !important;
                        border-color: #6c757d !important;
                        color: #fff !important;
                    }
                    .btn-reset:hover {
                        background-color: #5c636a !important;
                        border-color: #565e64 !important;
                    }

                    .btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .loading-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255, 255, 255, 0.9);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        border-radius: 12px;
                        z-index: 10;
                    }

                    .spinner-border {
                        width: 3rem;
                        height: 3rem;
                        border-width: 0.3em;
                    }

                    .loading-text {
                        margin-top: 15px;
                        color: #6c757d;
                        font-weight: 500;
                    }
                `}
            </style>

            <div className="modal-form-container" onClick={(e) => e.stopPropagation()}>
                {/* Loading Overlay */}
                {(isLoadingMiqaatData || isLoading) && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="loading-text">
                            {isLoadingMiqaatData ? 'Loading miqaat data...' : 'Updating...'}
                        </p>
                    </div>
                )}

                <div className="form-title">
                    <span>
                        <i className="ri-edit-line me-2"></i>
                        {title}
                    </span>
                    <button 
                        className="close-btn" 
                        onClick={handleClose} 
                        title="Close" 
                        disabled={isLoading || isLoadingMiqaatData}
                    >
                        &times;
                    </button>
                </div>
                
                {!isLoadingMiqaatData && (
                    <>
                        {/* Row 1: Miqaat Name and Miqaat Type */}
                        <div className="form-row-inline">
                            <div className="horizontal-form-group">
                                <Form.Label>Miqaat Name <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Form.Control
                                        type="text"
                                        name="miqaatName"
                                        value={formData.miqaatName}
                                        onChange={handleInputChange}
                                        placeholder="Enter Miqaat Name"
                                        className={errors.miqaatName ? 'is-invalid' : ''}
                                        disabled={isLoading}
                                    />
                                    {errors.miqaatName && <div className="error-text">{errors.miqaatName}</div>}
                                </div>
                            </div>

                            <div className="horizontal-form-group">
                                <Form.Label>Miqaat Type <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Select
                                        options={miqaatTypeOptions}
                                        value={formData.miqaatType}
                                        onChange={(option) => handleSelectChange('miqaatType', option)}
                                        placeholder="Select Miqaat Type"
                                        isClearable
                                        styles={selectStyles}
                                        error={errors.miqaatType}
                                        isDisabled={isLoading || isLoadingMiqaatTypes}
                                        isLoading={isLoadingMiqaatTypes}
                                    />
                                    {errors.miqaatType && <div className="error-text">{errors.miqaatType}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Start Date & Time and End Date & Time */}
                        <div className="form-row-inline">
                            <div className="horizontal-form-group">
                                <Form.Label>Start Date & Time <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <div className="datetime-row">
                                        <div className="date-input">
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                min={getTodayDate()}
                                                className={errors.startDate ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                            />
                                            {errors.startDate && <div className="error-text">{errors.startDate}</div>}
                                        </div>
                                        <div className="time-input">
                                            <Form.Control
                                                type="time"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                className={errors.startTime ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                                step="300"
                                            />
                                            {errors.startTime && <div className="error-text">{errors.startTime}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="horizontal-form-group">
                                <Form.Label>End Date & Time <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <div className="datetime-row">
                                        <div className="date-input">
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                min={formData.startDate || getTodayDate()}
                                                className={errors.endDate ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                            />
                                            {errors.endDate && <div className="error-text">{errors.endDate}</div>}
                                        </div>
                                        <div className="time-input">
                                            <Form.Control
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                className={errors.endTime ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                                step="300"
                                            />
                                            {errors.endTime && <div className="error-text">{errors.endTime}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Reporting Date & Time and Venue */}
                        <div className="form-row-inline">
                            <div className="horizontal-form-group">
                                <Form.Label>Reporting Date & Time <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <div className="datetime-row">
                                        <div className="date-input">
                                            <Form.Control
                                                type="date"
                                                name="reportingDate"
                                                value={formData.reportingDate}
                                                onChange={handleInputChange}
                                                min={getTodayDate()}
                                                max={formData.endDate|| undefined}
                                                className={errors.reportingDate ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                            />
                                            {errors.reportingDate && <div className="error-text">{errors.reportingDate}</div>}
                                        </div>
                                        <div className="time-input">
                                            <Form.Control
                                                type="time"
                                                name="reportingTime"
                                                value={formData.reportingTime}
                                                onChange={handleInputChange}
                                                className={errors.reportingTime ? 'is-invalid' : ''}
                                                disabled={isLoading}
                                                step="300"
                                            />
                                            {errors.reportingTime && <div className="error-text">{errors.reportingTime}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="horizontal-form-group">
                                <Form.Label>Venue <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Form.Control
                                        type="text"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleInputChange}
                                        placeholder="Enter Venue"
                                        className={errors.venue ? 'is-invalid' : ''}
                                        disabled={isLoading}
                                    />
                                    {errors.venue && <div className="error-text">{errors.venue}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Jamiaat and Jamaat */}
                        <div className="form-row-inline">
                            <div className="horizontal-form-group">
                                <Form.Label>Jamiaat <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Select
                                        options={jamiaatOptions}
                                        value={formData.jamiaat}
                                        onChange={handleJamiaatChange}
                                        placeholder="Select Jamiaat"
                                        isClearable
                                        styles={selectStyles}
                                        error={errors.jamiaat}
                                        isDisabled={isLoading || isLoadingJamiaats}
                                        isLoading={isLoadingJamiaats}
                                    />
                                    {errors.jamiaat && <div className="error-text">{errors.jamiaat}</div>}
                                </div>
                            </div>

                            <div className="horizontal-form-group">
                                <Form.Label>Jamaat <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Select
                                        options={jamaatOptions}
                                        value={formData.jamaat}
                                        onChange={(option) => handleSelectChange('jamaat', option)}
                                        placeholder={isLoadingJamaats ? "Loading..." : "Select Jamaat"}
                                        isClearable
                                        styles={selectStyles}
                                        error={errors.jamaat}
                                        isDisabled={isLoading || isLoadingJamaats || !formData.jamiaat}
                                        isLoading={isLoadingJamaats}
                                        noOptionsMessage={() => formData.jamiaat ? "No jamaat found" : "Please select Jamiaat first"}
                                    />
                                    {errors.jamaat && <div className="error-text">{errors.jamaat}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Row 5: Quantity and Is Active */}
                        <div className="form-row-inline">
                            <div className="horizontal-form-group">
                                <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                                <div className="form-input-wrapper">
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="Enter Quantity"
                                        min="1"
                                        className={errors.quantity ? 'is-invalid' : ''}
                                        disabled={isLoading}
                                    />
                                    {errors.quantity && <div className="error-text">{errors.quantity}</div>}
                                </div>
                            </div>

                            <div className="horizontal-form-group">
                                <Form.Label></Form.Label>
                                <div className="form-input-wrapper">
                                    <div className="checkbox-wrapper">
                                        <Form.Check
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            label="Active"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="form-buttons">
                    <Button 
                        variant="primary" 
                        onClick={handleUpdate} 
                        disabled={isLoading || !hasChanges() || isLoadingMiqaatData}
                    >
                        <i className="ri-save-line me-1"></i> 
                        {isLoading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={handleClose} 
                        disabled={isLoading || isLoadingMiqaatData}
                    >
                        <i className="ri-arrow-left-line me-1"></i> Back
                    </Button>
                    <Button 
                        className="btn-reset" 
                        onClick={handleReset} 
                        disabled={isLoading || !hasChanges() || isLoadingMiqaatData}
                    >
                        <i className="ri-refresh-line me-1"></i> Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

// const MiqaatTable = () => {
//     // State management
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [editMiqaatId, setEditMiqaatId] = useState(null);
//     const [tableData, setTableData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Modal state management
//     const [modals, setModals] = useState({});
//     const [deleteData, setDeleteData] = useState({
//         id: null,
//         name: ''
//     });

//     // ✅ Force Grid refresh
//     const [gridKey, setGridKey] = useState(0);

//     // Delete hook
//     const { deleteMiqaat, isDeleting, deleteError, resetDeleteState } = useDeleteMiqaat();

//     // Modal handlers
//     const handleModalOpen = (modalName) => {
//         setModals((prevModals) => ({ ...prevModals, [modalName]: true }));
//     };

//     const handleModalClose = (modalName) => {
//         setModals((prevModals) => ({ ...prevModals, [modalName]: false }));
//         if (modalName === 'deleteModal') {
//             resetDeleteState();
//         }
//     };

//     // Fetch miqaat data from API
//     const fetchMiqaatData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const accessToken = sessionStorage.getItem('access_token');
            
//             if (!accessToken) {
//                 throw new Error('Access token not found. Please login again.');
//             }

//             const apiUrl = `${API_BASE_URL}/Miqaat/GetAllMiqaat`;

//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`
//                 }
//             });

//             const contentType = response.headers.get('content-type');
//             if (!contentType || !contentType.includes('application/json')) {
//                 const textResponse = await response.text();
//                 console.error('Non-JSON response received:', textResponse.substring(0, 200));
//                 throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();

//             if (result.success && result.data) {
//                 // Transform API data to match table structure
//                 const transformedData = result.data.map((item, index) => ({
//                     id: item.miqaat_id,
//                     srNo: index + 1,
//                     miqaatName: item.miqaat_name,
//                     miqaatType: item.miqaat_type_name,
//                     miqaatTypeId: item.miqaat_type_id,
//                     startDate: formatDate(item.start_date),
//                     endDate: formatDate(item.end_date),
//                     venue: item.venue || '-',
//                     jamaat: item.jamaat_name || '-',
//                     jamaatId: item.jamaat_id,
//                     jamiaat: item.jamiaat_name || '-',
//                     jamiaatId: item.jamiaat_id,
//                     quantity: item.quantity || 0,
//                     isActive: item.is_active,
//                     reportingTime: extractTime(item.reporting_time)
//                 }));

//                 setTableData(transformedData);
//             } else {
//                 throw new Error(result.message || 'Failed to fetch miqaat data');
//             }
//         } catch (err) {
//             console.error('Error fetching miqaat data:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Helper function to format date
//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         const date = new Date(dateString);
//         return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
//     };

//     // Helper function to extract time
//     const extractTime = (dateString) => {
//         if (!dateString) return '-';
//         const date = new Date(dateString);
//         return date.toLocaleTimeString('en-US', { 
//             hour: '2-digit', 
//             minute: '2-digit',
//             hour12: true 
//         });
//     };

//     // Fetch data on component mount
//     useEffect(() => {
//         fetchMiqaatData();
//     }, []);

//     // Total records count
//     const totalRecords = tableData.length;

//     // Handle Add button click
//     const handleAdd = () => {
//         setShowAddForm(true);
//     };

//     // Handle Close Add modal
//     const handleCloseAddModal = () => {
//         setShowAddForm(false);
//     };

//     // Handle Close Edit modal
//     const handleCloseEditModal = () => {
//         setShowEditForm(false);
//         setEditMiqaatId(null);
//     };

//     // Handle Save (for Add)
//     const handleSave = (data) => {
//         console.log('Saved Data:', data);
//         setShowAddForm(false);
        
//         // Refresh the table
//         fetchMiqaatData();
        
//         // Force grid refresh
//         setGridKey(prev => prev + 1);
//     };

//     // Handle Update (for Edit)
//     const handleUpdate = (data) => {
//         console.log('Updated Data:', data);
//         setShowEditForm(false);
//         setEditMiqaatId(null);
        
//         // Optimistic update - update the specific row in the table
//         setTableData(prevData => {
//             return prevData.map(item => {
//                 if (item.id === data.miqaat_id) {
//                     return {
//                         ...item,
//                         miqaatName: data.miqaat_name,
//                         miqaatType: data.miqaat_type_name,
//                         miqaatTypeId: data.miqaat_type_id,
//                         startDate: formatDate(data.start_date),
//                         endDate: formatDate(data.end_date),
//                         venue: data.venue || '-',
//                         jamaat: data.jamaat_name || '-',
//                         jamaatId: data.jamaat_id,
//                         jamiaat: data.jamiaat_name || '-',
//                         jamiaatId: data.jamiaat_id,
//                         quantity: data.quantity || 0,
//                         isActive: data.is_active,
//                         reportingTime: extractTime(data.start_date)
//                     };
//                 }
//                 return item;
//             });
//         });
        
//         // Force grid refresh
//         setGridKey(prev => prev + 1);
        
//         // Background sync with server
//         setTimeout(() => {
//             fetchMiqaatData();
//         }, 500);
//     };

//     // Handle Edit
//     const handleEdit = (id) => {
//         console.log('Editing miqaat ID:', id);
//         setEditMiqaatId(id);
//         setShowEditForm(true);
//     };

//     // Handle Delete - Show confirmation modal
//     const handleDelete = (id) => {
//         const miqaatToDelete = tableData.find(item => item.id === id);
//         const miqaatName = miqaatToDelete ? miqaatToDelete.miqaatName : 'this miqaat';
        
//         setDeleteData({ id, name: miqaatName });
//         handleModalOpen('deleteModal');
//     };

//     // ✅ Confirm Delete - WITH ALL FIXES
//     const confirmDelete = async () => {
//         const miqaatIdToDelete = deleteData.id;
        
//         console.log('Deleting miqaat ID:', miqaatIdToDelete);
        
//         const result = await deleteMiqaat(miqaatIdToDelete);
        
//         if (result.success) {
//             console.log('Delete successful, updating UI...');
            
//             // ✅ METHOD 1: Optimistic update - instant UI change
//             setTableData(prevData => {
//                 const filtered = prevData.filter(item => item.id !== miqaatIdToDelete);
//                 // Recalculate serial numbers
//                 return filtered.map((item, index) => ({
//                     ...item,
//                     srNo: index + 1
//                 }));
//             });
            
//             // ✅ METHOD 2: Force Grid to re-render
//             setGridKey(prev => prev + 1);
            
//             // Close modal
//             handleModalClose('deleteModal');
//             setDeleteData({ id: null, name: '' });
            
//             // ✅ METHOD 3: Background sync with server
//             setTimeout(async () => {
//                 try {
//                     await fetchMiqaatData();
//                     console.log('Table synced with server');
//                 } catch (error) {
//                     console.error('Background sync failed:', error);
//                 }
//             }, 500);
//         }
//     };

//     // Make functions globally accessible for Grid.js buttons
//     useEffect(() => {
//         window.handleEditClick = handleEdit;
//         window.handleDeleteClick = handleDelete;

//         return () => {
//             delete window.handleEditClick;
//             delete window.handleDeleteClick;
//         };
//     }, [tableData]);

//     // ✅ Format data for Grid.js with useMemo - ONLY REQUIRED FIELDS
//     const gridData = useMemo(() => {
//         console.log('Recalculating gridData, table length:', tableData.length);
//         return tableData.map(item => [
//             item.srNo,
//             item.miqaatName,
//             item.miqaatType,
//             item.venue,
//             item.jamaat,
//             item.isActive ? 'Active' : 'Inactive',
//             item.reportingTime,
//             item.id
//         ]);
//     }, [tableData]);

//     return (
//         <Fragment>
//             {/* Custom styles */}
//             <style>
//                 {`
//                     /* Search bar styles */
//                     #grid-miqaat-table .gridjs-search {
//                         width: 100%;
//                         margin-bottom: 1rem;
//                     }
//                     #grid-miqaat-table .gridjs-search-input {
//                         width: 100%;
//                         padding: 8px 12px;
//                         border: 1px solid #dee2e6;
//                         border-radius: 6px;
//                         font-size: 14px;
//                     }
//                     #grid-miqaat-table .gridjs-search-input:focus {
//                         outline: none;
//                         border-color: #0d6efd;
//                         box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
//                     }
//                     #grid-miqaat-table .gridjs-wrapper {
//                         margin-top: 0.5rem;
//                         overflow-x: auto;
//                         -webkit-overflow-scrolling: touch;
//                     }
//                     #grid-miqaat-table .gridjs-table {
//                         min-width: 1200px;
//                     }
//                     #grid-miqaat-table .gridjs-container {
//                         padding: 0;
//                     }

//                     /* Sorting arrow styles */
//                     #grid-miqaat-table .gridjs-th-sort {
//                         position: relative;
//                         cursor: pointer;
//                     }
//                     #grid-miqaat-table .gridjs-th-content {
//                         display: flex;
//                         align-items: center;
//                         justify-content: space-between;
//                         width: 100%;
//                     }
//                     #grid-miqaat-table button.gridjs-sort {
//                         background: none;
//                         border: none;
//                         width: 20px;
//                         height: 20px;
//                         position: relative;
//                         cursor: pointer;
//                         float: right;
//                         margin-left: 8px;
//                     }
//                     #grid-miqaat-table button.gridjs-sort::before,
//                     #grid-miqaat-table button.gridjs-sort::after {
//                         content: '';
//                         position: absolute;
//                         left: 50%;
//                         transform: translateX(-50%);
//                         width: 0;
//                         height: 0;
//                         border-left: 5px solid transparent;
//                         border-right: 5px solid transparent;
//                     }
//                     #grid-miqaat-table button.gridjs-sort::before {
//                         top: 2px;
//                         border-bottom: 6px solid #bbb;
//                     }
//                     #grid-miqaat-table button.gridjs-sort::after {
//                         bottom: 2px;
//                         border-top: 6px solid #bbb;
//                     }
//                     #grid-miqaat-table button.gridjs-sort-asc::before {
//                         border-bottom-color: #333;
//                     }
//                     #grid-miqaat-table button.gridjs-sort-asc::after {
//                         border-top-color: #bbb;
//                     }
//                     #grid-miqaat-table button.gridjs-sort-desc::before {
//                         border-bottom-color: #bbb;
//                     }
//                     #grid-miqaat-table button.gridjs-sort-desc::after {
//                         border-top-color: #333;
//                     }
//                     #grid-miqaat-table .gridjs-sort-neutral,
//                     #grid-miqaat-table .gridjs-sort-asc,
//                     #grid-miqaat-table .gridjs-sort-desc {
//                         background-image: none !important;
//                     }

//                     /* Pagination styles */
//                     #grid-miqaat-table .gridjs-footer {
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                         padding: 12px 0;
//                         border-top: 1px solid #e9ecef;
//                         margin-top: 1rem;
//                     }
//                     #grid-miqaat-table .gridjs-pagination {
//                         display: flex;
//                         width: 100%;
//                         justify-content: space-between;
//                         align-items: center;
//                     }
//                     #grid-miqaat-table .gridjs-summary {
//                         order: 1;
//                         color: #6c757d;
//                         font-size: 14px;
//                     }
//                     #grid-miqaat-table .gridjs-pages {
//                         order: 2;
//                         display: flex;
//                         gap: 5px;
//                     }
//                     #grid-miqaat-table .gridjs-pages button {
//                         min-width: 35px;
//                         height: 35px;
//                         border: 1px solid #dee2e6;
//                         background: #fff;
//                         border-radius: 6px;
//                         cursor: pointer;
//                         transition: all 0.2s ease;
//                         font-size: 14px;
//                     }
//                     #grid-miqaat-table .gridjs-pages button:hover:not(:disabled) {
//                         background: #e9ecef;
//                         border-color: #adb5bd;
//                     }
//                     #grid-miqaat-table .gridjs-pages button:disabled {
//                         opacity: 0.5;
//                         cursor: not-allowed;
//                     }
//                     #grid-miqaat-table .gridjs-pages button.gridjs-currentPage {
//                         background: var(--primary-color, #0d6efd);
//                         color: #fff;
//                         border-color: var(--primary-color, #0d6efd);
//                     }

//                     /* Action buttons spacing */
//                     #grid-miqaat-table .btn-action-group {
//                         display: inline-flex;
//                         gap: 10px;
//                         align-items: center;
//                     }
//                     #grid-miqaat-table .btn-action-group .btn {
//                         margin: 0 !important;
//                     }

//                     /* Scrollbar Styles */
//                     #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar {
//                         height: 8px;
//                     }
//                     #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-track {
//                         background: #f1f1f1;
//                         border-radius: 4px;
//                     }
//                     #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-thumb {
//                         background: #c1c1c1;
//                         border-radius: 4px;
//                     }
//                     #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-thumb:hover {
//                         background: #a1a1a1;
//                     }

//                     /* Loading and Error styles */
//                     .loading-container, .error-container {
//                         text-align: center;
//                         padding: 40px;
//                         color: #6c757d;
//                     }
//                     .error-container {
//                         color: #dc3545;
//                     }
//                     .error-container .error-message {
//                         background: #fff3cd;
//                         border: 1px solid #ffc107;
//                         border-radius: 8px;
//                         padding: 15px;
//                         margin: 20px auto;
//                         max-width: 600px;
//                         text-align: left;
//                     }
//                     .error-container .error-title {
//                         font-weight: 600;
//                         color: #856404;
//                         margin-bottom: 10px;
//                     }
//                     .error-container .error-details {
//                         color: #856404;
//                         font-size: 14px;
//                         word-break: break-word;
//                     }
//                     .spinner-border {
//                         width: 3rem;
//                         height: 3rem;
//                         border-width: 0.3em;
//                     }
//                 `}
//             </style>

//             {/* Confirm Delete Modal */}
//             <ConfirmDeleteModal
//                 show={modals['deleteModal'] || false}
//                 onHide={() => handleModalClose('deleteModal')}
//                 onConfirm={confirmDelete}
//                 title="Delete Miqaat"
//                 message="Are you sure you want to delete this miqaat? This will perform a soft delete - the miqaat will be marked as deleted but data remains in the database."
//                 itemName={deleteData.name}
//                 confirmText={isDeleting ? "Deleting..." : "Delete"}
//                 cancelText="Cancel"
//                 variant="danger"
//             />

//             {/* AddMiqaat Modal */}
//             <AddMiqaat
//                 show={showAddForm}
//                 onClose={handleCloseAddModal}
//                 onSave={handleSave}
//             />

//             {/* EditMiqaat Modal */}
//             <EditMiqaat
//                 show={showEditForm}
//                 onClose={handleCloseEditModal}
//                 onUpdate={handleUpdate}
//                 miqaatId={editMiqaatId}
//             />

//             {/* Main Table */}
//             <Row>
//                 <Col xl={12}>
//                     <Card className="custom-card">
//                         <Card.Header className="d-flex align-items-center justify-content-between">
//                             <div>
//                                 <Card.Title className="mb-1">
//                                     Miqaat Master
//                                 </Card.Title>
//                                 <span className="badge bg-primary-transparent">
//                                     Total Records: {totalRecords}
//                                 </span>
//                             </div>
//                             <div className="d-flex gap-2">
//                                 <IconButton.IconButton
//                                     variant="primary"
//                                     icon="ri-add-line"
//                                     onClick={handleAdd}
//                                     title="Add New"
//                                 />
//                             </div>
//                         </Card.Header>
//                         <Card.Body>
//                             {loading ? (
//                                 <div className="loading-container">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                     <p className="mt-3">Loading miqaat data...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="error-container">
//                                     <i className="ri-error-warning-line" style={{ fontSize: '48px' }}></i>
//                                     <div className="error-message">
//                                         <div className="error-title">⚠️ Error Loading Miqaat</div>
//                                         <div className="error-details">{error}</div>
//                                     </div>
//                                     <button 
//                                         className="btn btn-primary mt-3" 
//                                         onClick={fetchMiqaatData}
//                                     >
//                                         <i className="ri-refresh-line me-2"></i>
//                                         Retry
//                                     </button>
//                                     <div className="mt-3">
//                                         <small className="text-muted">
//                                             Check browser console (F12) for more details
//                                         </small>
//                                     </div>
//                                 </div>
//                             ) : tableData.length === 0 ? (
//                                 <div className="loading-container">
//                                     <i className="ri-inbox-line" style={{ fontSize: '48px' }}></i>
//                                     <p className="mt-3">No miqaat records found</p>
//                                     <button 
//                                         className="btn btn-primary mt-2" 
//                                         onClick={handleAdd}
//                                     >
//                                         <i className="ri-add-line me-2"></i>
//                                         Add First Miqaat
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div id="grid-miqaat-table">
//                                     <Grid
//                                         key={gridKey}
//                                         data={gridData}
//                                         sort={true}
//                                         search={{
//                                             enabled: true,
//                                             placeholder: 'Search miqaat...'
//                                         }}
//                                         columns={[
//                                             { 
//                                                 name: 'Sr',
//                                                 width: '80px',
//                                                 sort: true
//                                             }, 
//                                             { 
//                                                 name: 'Miqaat Name',
//                                                 width: '250px',
//                                                 sort: true
//                                             }, 
//                                             { 
//                                                 name: 'Miqaat Type',
//                                                 width: '150px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Venue',
//                                                 width: '250px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Jamaat',
//                                                 width: '150px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Is Active',
//                                                 width: '100px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Reporting Time',
//                                                 width: '150px',
//                                                 sort: true
//                                             },
//                                             {
//                                                 name: 'Action',
//                                                 width: '150px',
//                                                 sort: false,
//                                                 formatter: (cell) => html(`
//                                                     <div class="btn-action-group">
//                                                         <button 
//                                                             class="btn btn-sm btn-info-transparent btn-icon btn-wave" 
//                                                             title="Edit"
//                                                             onclick="handleEditClick(${cell})"
//                                                         >
//                                                             <i class="ri-edit-line"></i>
//                                                         </button>
//                                                         <button 
//                                                             class="btn btn-sm btn-danger-transparent btn-icon btn-wave" 
//                                                             title="Delete"
//                                                             onclick="handleDeleteClick(${cell})"
//                                                         >
//                                                             <i class="ri-delete-bin-line"></i>
//                                                         </button>
//                                                     </div>
//                                                 `)
//                                             }
//                                         ]} 
//                                         pagination={{
//                                             limit: 5,
//                                             summary: true
//                                         }}
//                                         className={{
//                                             table: 'table table-bordered',
//                                             search: 'gridjs-search mb-3',
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Fragment>
//     );
// };


// const useDeleteMiqaat = () => {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [deleteError, setDeleteError] = useState(null);

//     /**
//      * Delete a miqaat by ID
//      * @param {number} miqaatId - The ID of the miqaat to delete
//      * @returns {Promise<Object>} - Result object with success flag and message
//      */
//     const deleteMiqaat = async (miqaatId) => {
//         setIsDeleting(true);
//         setDeleteError(null);

//         try {
//             // Get access token from session storage
//             const token = sessionStorage.getItem('access_token');

//             if (!token) {
//                 toast.error('Authentication token not found. Please login again.');
//                 setIsDeleting(false);
//                 return { success: false, message: 'Authentication token not found' };
//             }

//             // Validate miqaat ID
//             if (!miqaatId) {
//                 toast.error('Miqaat ID is required');
//                 setIsDeleting(false);
//                 return { success: false, message: 'Miqaat ID is required' };
//             }

//             // API endpoint
//             const apiUrl = `${API_BASE_URL}/Miqaat/DeleteMiqaat`;

//             console.log('Deleting miqaat:', miqaatId);
//             console.log('API URL:', apiUrl);

//             // Make DELETE request
//             const response = await fetch(apiUrl, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     miqaat_id: miqaatId
//                 })
//             });

//             console.log('Delete response status:', response.status);

//             // Handle 401 Unauthorized (session expired)
//             if (response.status === 401) {
//                 toast.error('Session expired. Please login again.');
//                 setDeleteError('Session expired');
//                 setIsDeleting(false);
//                 return { success: false, message: 'Session expired' };
//             }

//             // Check content type before parsing JSON
//             const contentType = response.headers.get('content-type');
//             console.log('Content-Type:', contentType);

//             if (!contentType || !contentType.includes('application/json')) {
//                 const textResponse = await response.text();
//                 console.error('Non-JSON response received:', textResponse.substring(0, 200));
//                 toast.error('Server returned invalid response. Please try again.');
//                 setDeleteError('Invalid server response');
//                 setIsDeleting(false);
//                 return { 
//                     success: false, 
//                     message: 'Server returned invalid response' 
//                 };
//             }

//             // Parse JSON response
//             const result = await response.json();
//             console.log('Delete result:', result);

//             // Check if response is successful
//             if (response.ok && result.success) {
//                 // Handle different result codes
//                 if (result.data?.result_code === 3) {
//                     // Success
//                     toast.success('Miqaat deleted successfully!');
//                     setIsDeleting(false);
//                     return {
//                         success: true,
//                         message: result.message || 'Miqaat deleted successfully',
//                         data: result.data
//                     };
//                 } else if (result.data?.result_code === 0) {
//                     // Failure - Miqaat not found or already deleted
//                     toast.error('Miqaat not found or already deleted');
//                     setDeleteError('Miqaat not found or already deleted');
//                     setIsDeleting(false);
//                     return {
//                         success: false,
//                         message: 'Miqaat not found or already deleted'
//                     };
//                 } else {
//                     // Unknown result code
//                     toast.error(result.message || 'Failed to delete miqaat');
//                     setDeleteError(result.message || 'Failed to delete miqaat');
//                     setIsDeleting(false);
//                     return {
//                         success: false,
//                         message: result.message || 'Failed to delete miqaat'
//                     };
//                 }
//             } else {
//                 // Response not OK or not successful
//                 const errorMessage = result.message || result.detail || 'Failed to delete miqaat';
//                 toast.error(errorMessage);
//                 setDeleteError(errorMessage);
//                 setIsDeleting(false);
//                 return {
//                     success: false,
//                     message: errorMessage
//                 };
//             }
//         } catch (error) {
//             console.error('Error deleting miqaat:', error);
//             const errorMessage = error.message || 'An error occurred while deleting the miqaat. Please try again.';
//             toast.error(errorMessage);
//             setDeleteError(errorMessage);
//             setIsDeleting(false);
//             return {
//                 success: false,
//                 message: errorMessage,
//                 error: error
//             };
//         }
//     };

//     /**
//      * Reset delete state
//      */
//     const resetDeleteState = () => {
//         setIsDeleting(false);
//         setDeleteError(null);
//     };

//     return {
//         deleteMiqaat,
//         isDeleting,
//         deleteError,
//         resetDeleteState
//     };
// };







// import React, { useState, useEffect, useMemo, Fragment } from 'react';
// import { Card, Col, Row } from 'react-bootstrap';
// import { Grid, html } from 'gridjs';
// import Swal from 'sweetalert2';
// import AddMiqaat from './AddMiqaat';
// import EditMiqaat from './EditMiqaat';
// import * as IconButton from '../IconButton/IconButton';

const MiqaatTable = () => {
    // State management
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editMiqaatId, setEditMiqaatId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Force Grid refresh
    const [gridKey, setGridKey] = useState(0);

    // Fetch miqaat data from API
    const fetchMiqaatData = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                throw new Error('Access token not found. Please login again.');
            }

            const apiUrl = `${API_BASE_URL}/Miqaat/GetAllMiqaat`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response received:', textResponse.substring(0, 200));
                throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                // Transform API data to match table structure
                const transformedData = result.data.map((item, index) => ({
                    id: item.miqaat_id,
                    srNo: index + 1,
                    miqaatName: item.miqaat_name,
                    miqaatType: item.miqaat_type_name,
                    miqaatTypeId: item.miqaat_type_id,
                    startDate: formatDate(item.start_date),
                    endDate: formatDate(item.end_date),
                    venue: item.venue || '-',
                    jamaat: item.jamaat_name || '-',
                    jamaatId: item.jamaat_id,
                    jamiaat: item.jamiaat_name || '-',
                    jamiaatId: item.jamiaat_id,
                    quantity: item.quantity || 0,
                    isActive: item.is_active,
                    reportingTime: extractTime(item.reporting_time)
                }));

                setTableData(transformedData);
            } else {
                throw new Error(result.message || 'Failed to fetch miqaat data');
            }
        } catch (err) {
            console.error('Error fetching miqaat data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    // Helper function to extract time
    const extractTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchMiqaatData();
    }, []);

    // Total records count
    const totalRecords = tableData.length;

    // Handle Add button click
    const handleAdd = () => {
        setShowAddForm(true);
    };

    // Handle Close Add modal
    const handleCloseAddModal = () => {
        setShowAddForm(false);
    };

    // Handle Close Edit modal
    const handleCloseEditModal = () => {
        setShowEditForm(false);
        setEditMiqaatId(null);
    };

    // Handle Save (for Add)
    const handleSave = (data) => {
        console.log('Saved Data:', data);
        setShowAddForm(false);
        
        // Refresh the table
        fetchMiqaatData();
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
    };

    // Handle Update (for Edit)
    const handleUpdate = (data) => {
        console.log('Updated Data:', data);
        setShowEditForm(false);
        setEditMiqaatId(null);
        
        // Optimistic update - update the specific row in the table
        setTableData(prevData => {
            return prevData.map(item => {
                if (item.id === data.miqaat_id) {
                    return {
                        ...item,
                        miqaatName: data.miqaat_name,
                        miqaatType: data.miqaat_type_name,
                        miqaatTypeId: data.miqaat_type_id,
                        startDate: formatDate(data.start_date),
                        endDate: formatDate(data.end_date),
                        venue: data.venue || '-',
                        jamaat: data.jamaat_name || '-',
                        jamaatId: data.jamaat_id,
                        jamiaat: data.jamiaat_name || '-',
                        jamiaatId: data.jamiaat_id,
                        quantity: data.quantity || 0,
                        isActive: data.is_active,
                        reportingTime: extractTime(data.start_date)
                    };
                }
                return item;
            });
        });
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
        
        // Background sync with server
        setTimeout(() => {
            fetchMiqaatData();
        }, 500);
    };

    // Handle Edit
    const handleEdit = (id) => {
        console.log('Editing miqaat ID:', id);
        setEditMiqaatId(id);
        setShowEditForm(true);
    };

    // Handle Delete with SweetAlert2 confirmation
    const handleDelete = async (id) => {
        // Find the miqaat to get its name
        const miqaatToDelete = tableData.find(item => item.id === id);
        const miqaatName = miqaatToDelete ? miqaatToDelete.miqaatName : 'this miqaat';
        
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${miqaatName}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                throw new Error('Access token not found. Please login again.');
            }

            const response = await fetch(`${API_BASE_URL}/Miqaat/DeleteMiqaat`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    miqaat_id: id
                })
            });

            const apiResult = await response.json();
            console.log('Delete API Response:', apiResult);

            if (response.ok && apiResult.success) {
                const resultCode = Number(apiResult.data?.result_code);
                
                if (resultCode === 3) {
                    // Success
                    Swal.fire({
                        title: 'Deleted!',
                        text: apiResult.message || 'Miqaat has been deleted successfully.',
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: false,
                        showConfirmButton: false
                    });

                    // ✅ Optimistic update - instant UI change
                    setTableData(prevData => {
                        const filtered = prevData.filter(item => item.id !== id);
                        // Recalculate serial numbers
                        return filtered.map((item, index) => ({
                            ...item,
                            srNo: index + 1
                        }));
                    });
                    
                    // ✅ Force Grid to re-render
                    setGridKey(prev => prev + 1);
                    
                    // ✅ Background sync with server
                    setTimeout(async () => {
                        try {
                            await fetchMiqaatData();
                            console.log('Table synced with server');
                        } catch (error) {
                            console.error('Background sync failed:', error);
                        }
                    }, 500);

                } else if (resultCode === 0) {
                    // Failure - Miqaat not found or already deleted
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: 'Miqaat not found or already deleted',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(apiResult.message || 'Failed to delete miqaat');
                }
            } else {
                throw new Error(apiResult.message || `Server error: ${response.status}`);
            }

        } catch (error) {
            console.error('Error deleting miqaat:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while deleting',
                confirmButtonText: 'OK'
            });
        }
    };

    // Make functions globally accessible for Grid.js buttons
    useEffect(() => {
        window.handleEditClick = handleEdit;
        window.handleDeleteClick = handleDelete;

        return () => {
            delete window.handleEditClick;
            delete window.handleDeleteClick;
        };
    }, [tableData]);

    // ✅ Format data for Grid.js with useMemo - ONLY REQUIRED FIELDS
    const gridData = useMemo(() => {
        console.log('Recalculating gridData, table length:', tableData.length);
        return tableData.map(item => [
            item.srNo,
            item.miqaatName,
            item.miqaatType,
            item.venue,
            item.jamaat,
            item.isActive ? 'Active' : 'Inactive',
            item.reportingTime,
            item.id
        ]);
    }, [tableData]);

    return (
        <Fragment>
            {/* Custom styles */}
            <style>
                {`
                    /* Search bar styles */
                    #grid-miqaat-table .gridjs-search {
                        width: 100%;
                        margin-bottom: 1rem;
                    }
                    #grid-miqaat-table .gridjs-search-input {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        font-size: 14px;
                    }
                    #grid-miqaat-table .gridjs-search-input:focus {
                        outline: none;
                        border-color: #0d6efd;
                        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                    }
                    #grid-miqaat-table .gridjs-wrapper {
                        margin-top: 0.5rem;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    #grid-miqaat-table .gridjs-table {
                        min-width: 1200px;
                    }
                    #grid-miqaat-table .gridjs-container {
                        padding: 0;
                    }

                    /* Sorting arrow styles */
                    #grid-miqaat-table .gridjs-th-sort {
                        position: relative;
                        cursor: pointer;
                    }
                    #grid-miqaat-table .gridjs-th-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                    }
                    #grid-miqaat-table button.gridjs-sort {
                        background: none;
                        border: none;
                        width: 20px;
                        height: 20px;
                        position: relative;
                        cursor: pointer;
                        float: right;
                        margin-left: 8px;
                    }
                    #grid-miqaat-table button.gridjs-sort::before,
                    #grid-miqaat-table button.gridjs-sort::after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                    }
                    #grid-miqaat-table button.gridjs-sort::before {
                        top: 2px;
                        border-bottom: 6px solid #bbb;
                    }
                    #grid-miqaat-table button.gridjs-sort::after {
                        bottom: 2px;
                        border-top: 6px solid #bbb;
                    }
                    #grid-miqaat-table button.gridjs-sort-asc::before {
                        border-bottom-color: #333;
                    }
                    #grid-miqaat-table button.gridjs-sort-asc::after {
                        border-top-color: #bbb;
                    }
                    #grid-miqaat-table button.gridjs-sort-desc::before {
                        border-bottom-color: #bbb;
                    }
                    #grid-miqaat-table button.gridjs-sort-desc::after {
                        border-top-color: #333;
                    }
                    #grid-miqaat-table .gridjs-sort-neutral,
                    #grid-miqaat-table .gridjs-sort-asc,
                    #grid-miqaat-table .gridjs-sort-desc {
                        background-image: none !important;
                    }

                    /* Pagination styles */
                    #grid-miqaat-table .gridjs-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-top: 1px solid #e9ecef;
                        margin-top: 1rem;
                    }
                    #grid-miqaat-table .gridjs-pagination {
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                    }
                    #grid-miqaat-table .gridjs-summary {
                        order: 1;
                        color: #6c757d;
                        font-size: 14px;
                    }
                    #grid-miqaat-table .gridjs-pages {
                        order: 2;
                        display: flex;
                        gap: 5px;
                    }
                    #grid-miqaat-table .gridjs-pages button {
                        min-width: 35px;
                        height: 35px;
                        border: 1px solid #dee2e6;
                        background: #fff;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 14px;
                    }
                    #grid-miqaat-table .gridjs-pages button:hover:not(:disabled) {
                        background: #e9ecef;
                        border-color: #adb5bd;
                    }
                    #grid-miqaat-table .gridjs-pages button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    #grid-miqaat-table .gridjs-pages button.gridjs-currentPage {
                        background: var(--primary-color, #0d6efd);
                        color: #fff;
                        border-color: var(--primary-color, #0d6efd);
                    }

                    /* Action buttons spacing */
                    #grid-miqaat-table .btn-action-group {
                        display: inline-flex;
                        gap: 10px;
                        align-items: center;
                    }
                    #grid-miqaat-table .btn-action-group .btn {
                        margin: 0 !important;
                    }

                    /* Scrollbar Styles */
                    #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar {
                        height: 8px;
                    }
                    #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }
                    #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 4px;
                    }
                    #grid-miqaat-table .gridjs-wrapper::-webkit-scrollbar-thumb:hover {
                        background: #a1a1a1;
                    }

                    /* Loading and Error styles */
                    .loading-container, .error-container {
                        text-align: center;
                        padding: 40px;
                        color: #6c757d;
                    }
                    .error-container {
                        color: #dc3545;
                    }
                    .error-container .error-message {
                        background: #fff3cd;
                        border: 1px solid #ffc107;
                        border-radius: 8px;
                        padding: 15px;
                        margin: 20px auto;
                        max-width: 600px;
                        text-align: left;
                    }
                    .error-container .error-title {
                        font-weight: 600;
                        color: #856404;
                        margin-bottom: 10px;
                    }
                    .error-container .error-details {
                        color: #856404;
                        font-size: 14px;
                        word-break: break-word;
                    }
                    .spinner-border {
                        width: 3rem;
                        height: 3rem;
                        border-width: 0.3em;
                    }
                `}
            </style>

            {/* AddMiqaat Modal */}
            <AddMiqaat
                show={showAddForm}
                onClose={handleCloseAddModal}
                onSave={handleSave}
            />

            {/* EditMiqaat Modal */}
            <EditMiqaat
                show={showEditForm}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdate}
                miqaatId={editMiqaatId}
            />

            {/* Main Table */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <div>
                                <Card.Title className="mb-1">
                                    Miqaat Master
                                </Card.Title>
                                <span className="badge bg-primary-transparent">
                                    Total Records: {totalRecords}
                                </span>
                            </div>
                            <div className="d-flex gap-2">
                                <IconButton.IconButton
                                    variant="primary"
                                    icon="ri-add-line"
                                    onClick={handleAdd}
                                    title="Add New"
                                />
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className="loading-container">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading miqaat data...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <i className="ri-error-warning-line" style={{ fontSize: '48px' }}></i>
                                    <div className="error-message">
                                        <div className="error-title">⚠️ Error Loading Miqaat</div>
                                        <div className="error-details">{error}</div>
                                    </div>
                                    <button 
                                        className="btn btn-primary mt-3" 
                                        onClick={fetchMiqaatData}
                                    >
                                        <i className="ri-refresh-line me-2"></i>
                                        Retry
                                    </button>
                                    <div className="mt-3">
                                        <small className="text-muted">
                                            Check browser console (F12) for more details
                                        </small>
                                    </div>
                                </div>
                            ) : tableData.length === 0 ? (
                                <div className="loading-container">
                                    <i className="ri-inbox-line" style={{ fontSize: '48px' }}></i>
                                    <p className="mt-3">No miqaat records found</p>
                                    <button 
                                        className="btn btn-primary mt-2" 
                                        onClick={handleAdd}
                                    >
                                        <i className="ri-add-line me-2"></i>
                                        Add First Miqaat
                                    </button>
                                </div>
                            ) : (
                                <div id="grid-miqaat-table">
                                    <Grid
                                        key={gridKey}
                                        data={gridData}
                                        sort={true}
                                        search={{
                                            enabled: true,
                                            placeholder: 'Search miqaat...'
                                        }}
                                        columns={[
                                            { 
                                                name: 'Sr',
                                                width: '80px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Miqaat Name',
                                                width: '250px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Miqaat Type',
                                                width: '150px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Venue',
                                                width: '250px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Jamaat',
                                                width: '150px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Is Active',
                                                width: '100px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Reporting Time',
                                                width: '150px',
                                                sort: true
                                            },
                                            {
                                                name: 'Action',
                                                width: '150px',
                                                sort: false,
                                                formatter: (cell) => html(`
                                                    <div class="btn-action-group">
                                                        <button 
                                                            class="btn btn-sm btn-info-transparent btn-icon btn-wave" 
                                                            title="Edit"
                                                            onclick="handleEditClick(${cell})"
                                                        >
                                                            <i class="ri-edit-line"></i>
                                                        </button>
                                                        <button 
                                                            class="btn btn-sm btn-danger-transparent btn-icon btn-wave" 
                                                            title="Delete"
                                                            onclick="handleDeleteClick(${cell})"
                                                        >
                                                            <i class="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                `)
                                            }
                                        ]} 
                                        pagination={{
                                            limit: 5,
                                            summary: true
                                        }}
                                        className={{
                                            table: 'table table-bordered',
                                            search: 'gridjs-search mb-3',
                                        }}
                                    />
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};





// Global functions for Grid.js
if (typeof window !== 'undefined') {
    window.handleEditClick = (id) => {
        console.log('Edit clicked for ID:', id);
        window.dispatchEvent(new CustomEvent('editRecord', { detail: { id } }));
    };
    
    window.handleDeleteClick = (id) => {
        console.log('Delete clicked for ID:', id);
        window.dispatchEvent(new CustomEvent('deleteRecord', { detail: { id } }));
    };
}

export default MiqaatTable;