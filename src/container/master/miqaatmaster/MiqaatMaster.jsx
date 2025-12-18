import React, { Fragment, useState, useEffect, useMemo} from 'react';
import { Grid } from 'gridjs-react';
import { html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { Card, Row, Col } from 'react-bootstrap';
import IconButton from '../../elements/button'; 
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
 
import ConfirmDeleteModal from '../../../components/common/modalcloses/confirmdelete';


const API_BASE_URL = 'http://13.204.161.209:8080/BURHANI_GUARDS_API_TEST/api';




const AddMiqaat = ({ 
    show, 
    onClose, 
    onSave, 
    miqaatTypeOptions = [],
    jamiaatOptions = [], 
    jamaatOptions = [],
    editData = null,
    title = "Add New Miqaat"
}) => {
    
    // Form state
    const [formData, setFormData] = useState({
        miqaatName: '',
        miqaatType: null,
        startDate: '',
        endDate: '',
        venue: '',
        jamaat: null,
        jamiaat: null,
        quantity: '',
        isActive: true
    });

    // Validation errors state
    const [errors, setErrors] = useState({});

    // Default options if not provided
    const defaultMiqaatTypeOptions = [
        { value: 'Ashara', label: 'Ashara' },
        { value: 'Milad', label: 'Milad' },
        { value: 'Urus', label: 'Urus' },
        { value: 'Chehlum', label: 'Chehlum' },
        { value: 'Ramadan', label: 'Ramadan' },
        { value: 'Eid', label: 'Eid' },
    ];

    const defaultJamiaatOptions = [
        { value: 1, label: 'Anjuman-e-Burhani' },
        { value: 2, label: 'Anjuman-e-Najmi' },
        { value: 3, label: 'Anjuman-e-Saifee' },
        { value: 4, label: 'Anjuman-e-Fakhri' },
        { value: 5, label: 'Anjuman-e-Taheri' },
        { value: 6, label: 'Anjuman-e-Jamali' },
    ];

    const defaultJamaatOptions = [
        { value: 1, label: 'Mumbai Central' },
        { value: 2, label: 'Mumbai South' },
        { value: 3, label: 'Pune' },
        { value: 4, label: 'Surat' },
        { value: 5, label: 'Ahmedabad' },
        { value: 6, label: 'Kolkata' },
        { value: 7, label: 'Nairobi' },
    ];

    const miqaatTypeList = miqaatTypeOptions.length > 0 ? miqaatTypeOptions : defaultMiqaatTypeOptions;
    const jamiaatList = jamiaatOptions.length > 0 ? jamiaatOptions : defaultJamiaatOptions;
    const jamaatList = jamaatOptions.length > 0 ? jamaatOptions : defaultJamaatOptions;

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Populate form when editing
    useEffect(() => {
        if (editData) {
            setFormData({
                miqaatName: editData.miqaatName || '',
                miqaatType: editData.miqaatType ? 
                    miqaatTypeList.find(opt => opt.value === editData.miqaatType) || { value: editData.miqaatType, label: editData.miqaatType } 
                    : null,
                startDate: editData.startDate || '',
                endDate: editData.endDate || '',
                venue: editData.venue || '',
                jamaat: editData.jamaat ? 
                    jamaatList.find(opt => opt.label === editData.jamaat) || { value: editData.jamaat, label: editData.jamaat }
                    : null,
                jamiaat: editData.jamiaat ? 
                    jamiaatList.find(opt => opt.label === editData.jamiaat) || { value: editData.jamiaat, label: editData.jamiaat }
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

        if (!formData.miqaatName.trim()) {
            newErrors.miqaatName = 'Miqaat Name is required';
        }
        if (!formData.miqaatType) {
            newErrors.miqaatType = 'Miqaat Type is required';
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Start Date is required';
        } else if (formData.startDate < today) {
            newErrors.startDate = 'Start Date cannot be less than current date';
        }
        if (!formData.endDate) {
            newErrors.endDate = 'End Date is required';
        } else if (formData.startDate && formData.endDate < formData.startDate) {
            newErrors.endDate = 'End Date cannot be less than Start Date';
        }
        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }
        if (!formData.jamaat) {
            newErrors.jamaat = 'Jamaat is required';
        }
        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Jamiaat is required';
        }
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Save
    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        const dataToSave = {
            miqaatName: formData.miqaatName,
            miqaatType: formData.miqaatType?.value,
            startDate: formData.startDate,
            endDate: formData.endDate,
            venue: formData.venue,
            jamaatId: formData.jamaat?.value,
            jamaat: formData.jamaat?.label,
            jamiaatId: formData.jamiaat?.value,
            jamiaat: formData.jamiaat?.label,
            quantity: parseInt(formData.quantity),
            isActive: formData.isActive
        };

        if (onSave) {
            onSave(dataToSave);
        }
        handleClose();
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
            endDate: '',
            venue: '',
            jamaat: null,
            jamiaat: null,
            quantity: '',
            isActive: true
        });
        setErrors({});
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
                        max-width: 800px;
                        max-height: 90vh;
                        overflow-y: auto;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                        animation: slideIn 0.3s ease;
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
                        min-width: 100px;
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

                    .form-row-full {
                        margin-bottom: 15px;
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

                    .btn-clear {
                        background-color: #6c757d !important;
                        border-color: #6c757d !important;
                        color: #fff !important;
                    }
                    .btn-clear:hover {
                        background-color: #5c636a !important;
                        border-color: #565e64 !important;
                    }
                `}
            </style>
            <div className="modal-form-container" onClick={(e) => e.stopPropagation()}>
                <div className="form-title">
                    <span>
                        <i className={`ri-${editData ? 'edit' : 'add-circle'}-line me-2`}></i>
                        {editData ? 'Edit Miqaat' : title}
                    </span>
                    <button className="close-btn" onClick={handleClose} title="Close">
                        &times;
                    </button>
                </div>
                
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
                            />
                            {errors.miqaatName && <div className="error-text">{errors.miqaatName}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>Miqaat Type <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={miqaatTypeList}
                                value={formData.miqaatType}
                                onChange={(option) => handleSelectChange('miqaatType', option)}
                                placeholder="Select Miqaat Type"
                                isClearable
                                styles={selectStyles}
                                error={errors.miqaatType}
                            />
                            {errors.miqaatType && <div className="error-text">{errors.miqaatType}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 2: Start Date and End Date */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Start Date <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                min={getTodayDate()}
                                className={errors.startDate ? 'is-invalid' : ''}
                            />
                            {errors.startDate && <div className="error-text">{errors.startDate}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>End Date <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                min={formData.startDate || getTodayDate()}
                                className={errors.endDate ? 'is-invalid' : ''}
                            />
                            {errors.endDate && <div className="error-text">{errors.endDate}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 3: Venue */}
                <div className="form-row-full">
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
                            />
                            {errors.venue && <div className="error-text">{errors.venue}</div>}
                        </div>
                    </div>
                </div>

                {/* Row 4: Jamaat and Jamiaat */}
                <div className="form-row-inline">
                    <div className="horizontal-form-group">
                        <Form.Label>Jamaat <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={jamaatList}
                                value={formData.jamaat}
                                onChange={(option) => handleSelectChange('jamaat', option)}
                                placeholder="Select Jamaat"
                                isClearable
                                styles={selectStyles}
                                error={errors.jamaat}
                            />
                            {errors.jamaat && <div className="error-text">{errors.jamaat}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        <Form.Label>Jamiaat <span className="text-danger">*</span></Form.Label>
                        <div className="form-input-wrapper">
                            <Select
                                options={jamiaatList}
                                value={formData.jamiaat}
                                onChange={(option) => handleSelectChange('jamiaat', option)}
                                placeholder="Select Jamiaat"
                                isClearable
                                styles={selectStyles}
                                error={errors.jamiaat}
                            />
                            {errors.jamiaat && <div className="error-text">{errors.jamiaat}</div>}
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
                            />
                            {errors.quantity && <div className="error-text">{errors.quantity}</div>}
                        </div>
                    </div>

                    <div className="horizontal-form-group">
                        {/* <Form.Label>Is Active</Form.Label> */}
                        <div className="form-input-wrapper">
                            <div className="checkbox-wrapper">
                                <Form.Check
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    label="Active"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-buttons">
                    <Button variant="primary" onClick={handleSave}>
                        <i className="ri-save-line me-1"></i> Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        <i className="ri-arrow-left-line me-1"></i> Back
                    </Button>
                    <Button className="btn-clear" onClick={handleClear}>
                        <i className="ri-refresh-line me-1"></i> Clear
                    </Button>
                </div>
            </div>
        </div>
    );
};



// const MiqaatTable = () => {
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [editData, setEditData] = useState(null);

//     // Sample data with all required fields
//     const tableData = [
//         { 
//             id: 1, 
//             srNo: 1, 
//             miqaatName: 'Ashara Mubaraka 1446H', 
//             miqaatType: 'Ashara',
//             startDate: '2024-07-07',
//             endDate: '2024-07-16',
//             venue: 'Saifee Masjid, Mumbai',
//             jamaat: 'Mumbai Central',
//             jamiaat: 'Anjuman-e-Burhani',
//             quantity: 5000,
//             isActive: true,
//             reportingTime: '07:00 AM'
//         },
//         { 
//             id: 2, 
//             srNo: 2, 
//             miqaatName: 'Milad un Nabi 1446H', 
//             miqaatType: 'Milad',
//             startDate: '2024-09-15',
//             endDate: '2024-09-15',
//             venue: 'Burhani Complex, Pune',
//             jamaat: 'Pune',
//             jamiaat: 'Anjuman-e-Najmi',
//             quantity: 2000,
//             isActive: true,
//             reportingTime: '08:00 AM'
//         },
//         { 
//             id: 3, 
//             srNo: 3, 
//             miqaatName: 'Chehlum Imam Husain SA', 
//             miqaatType: 'Chehlum',
//             startDate: '2024-08-25',
//             endDate: '2024-08-25',
//             venue: 'Taheri Masjid, Surat',
//             jamaat: 'Surat',
//             jamiaat: 'Anjuman-e-Saifee',
//             quantity: 3500,
//             isActive: false,
//             reportingTime: '06:30 AM'
//         },
//         { 
//             id: 4, 
//             srNo: 4, 
//             miqaatName: 'Urus Syedna Mohammed Burhanuddin RA', 
//             miqaatType: 'Urus',
//             startDate: '2025-01-17',
//             endDate: '2025-01-17',
//             venue: 'Raudat Tahera, Mumbai',
//             jamaat: 'Mumbai South',
//             jamiaat: 'Anjuman-e-Burhani',
//             quantity: 10000,
//             isActive: true,
//             reportingTime: '05:00 AM'
//         },
//         { 
//             id: 5, 
//             srNo: 5, 
//             miqaatName: 'Lailatul Qadr', 
//             miqaatType: 'Ramadan',
//             startDate: '2025-03-27',
//             endDate: '2025-03-27',
//             venue: 'Saifee Masjid, Nairobi',
//             jamaat: 'Nairobi',
//             jamiaat: 'Anjuman-e-Fakhri',
//             quantity: 1500,
//             isActive: true,
//             reportingTime: '09:00 PM'
//         },
//         { 
//             id: 6, 
//             srNo: 6, 
//             miqaatName: 'Syedna Taher Saifuddin RA Urus', 
//             miqaatType: 'Urus',
//             startDate: '2025-02-20',
//             endDate: '2025-02-20',
//             venue: 'Raudat Tahera, Mumbai',
//             jamaat: 'Mumbai Central',
//             jamiaat: 'Anjuman-e-Burhani',
//             quantity: 8000,
//             isActive: true,
//             reportingTime: '06:00 AM'
//         },
//         { 
//             id: 7, 
//             srNo: 7, 
//             miqaatName: 'Moharram 1447H', 
//             miqaatType: 'Ashara',
//             startDate: '2025-06-27',
//             endDate: '2025-07-06',
//             venue: 'Saifee Masjid, Kolkata',
//             jamaat: 'Kolkata',
//             jamiaat: 'Anjuman-e-Taheri',
//             quantity: 4000,
//             isActive: false,
//             reportingTime: '07:30 AM'
//         },
//         { 
//             id: 8, 
//             srNo: 8, 
//             miqaatName: 'Eid ul Adha 1446H', 
//             miqaatType: 'Eid',
//             startDate: '2025-06-07',
//             endDate: '2025-06-07',
//             venue: 'Burhani Masjid, Ahmedabad',
//             jamaat: 'Ahmedabad',
//             jamiaat: 'Anjuman-e-Jamali',
//             quantity: 2500,
//             isActive: true,
//             reportingTime: '07:00 AM'
//         },
//     ];

//     const totalRecords = tableData.length;

//     const handleAdd = () => {
//         setEditData(null);
//         setShowAddForm(true);
//     };

//     const handleCloseModal = () => {
//         setShowAddForm(false);
//         setEditData(null);
//     };

//     const handleSave = (data) => {
//         console.log('Saved Data:', data);
//     };

//     // Listen for edit/delete events from Grid.js
//     useEffect(() => {
//         const handleEdit = (e) => {
//             const record = tableData.find(item => item.id === e.detail.id);
//             if (record) {
//                 setEditData(record);
//                 setShowAddForm(true);
//             }
//         };

//         const handleDelete = (e) => {
//             if (window.confirm('Are you sure you want to delete this record?')) {
//                 console.log('Delete record:', e.detail.id);
//                 // Add your delete API call here
//             }
//         };

//         window.addEventListener('editRecord', handleEdit);
//         window.addEventListener('deleteRecord', handleDelete);

//         return () => {
//             window.removeEventListener('editRecord', handleEdit);
//             window.removeEventListener('deleteRecord', handleDelete);
//         };
//     }, [tableData]);

//     // Format data for Grid.js
//     const gridData = tableData.map(item => [
//         item.srNo,
//         item.miqaatName,
//         item.miqaatType,
//         item.startDate,
//         item.endDate,
//         item.venue,
//         item.jamaat,
//         item.jamiaat,
//         item.quantity,
//         item.isActive ? 'Active' : 'Inactive',
//         item.reportingTime,
//         item.id
//     ]);

//     return (
//         <Fragment>
//             <style>
//                 {`
//                     /* Search bar styles */
//                     #grid-miqaat-table .gridjs-search {
//                         width: 100%;
//                         margin-bottom: 1rem;
//                     }
//                     #grid-miqaat-table .gridjs-search-input {
//                         width: 100%;
//                     }
//                     #grid-miqaat-table .gridjs-wrapper {
//                         margin-top: 0.5rem;
//                         overflow-x: auto;
//                         -webkit-overflow-scrolling: touch;
//                     }
//                     #grid-miqaat-table .gridjs-table {
//                         min-width: 1600px;
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
//                 `}
//             </style>

//             {/* AddMiqaat Modal - Uncomment when component is ready */}
//             <AddMiqaat
//                 show={showAddForm}
//                 onClose={handleCloseModal}
//                 onSave={handleSave}
//                 editData={editData}
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
//                             <div>
//                                 <IconButton.IconButton
//                                     variant="primary"
//                                     icon="ri-add-line"
//                                     onClick={handleAdd}
//                                     title="Add New"
//                                 />
//                             </div>
//                         </Card.Header>
//                         <Card.Body>
//                             <div id="grid-miqaat-table">
//                                 <Grid
//                                     data={gridData}
//                                     sort={true}
//                                     search={true}
//                                     columns={[
//                                         { 
//                                             name: 'Sr. No.',
//                                             width: '80px',
//                                             sort: true
//                                         }, 
//                                         { 
//                                             name: 'Miqaat Name',
//                                             width: '250px',
//                                             sort: true
//                                         }, 
//                                         { 
//                                             name: 'Miqaat Type',
//                                             width: '120px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Start Date',
//                                             width: '120px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'End Date',
//                                             width: '120px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Venue',
//                                             width: '250px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Jamaat',
//                                             width: '140px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Jamiaat',
//                                             width: '180px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Quantity',
//                                             width: '100px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Is Active',
//                                             width: '100px',
//                                             sort: true
//                                         },
//                                         { 
//                                             name: 'Reporting Time',
//                                             width: '170px',
//                                             sort: true
//                                         },
//                                         {
//                                             name: 'Action',
//                                             width: '150px',
//                                             sort: false,
//                                             formatter: (cell) => html(`
//                                                 <div class="btn-action-group">
//                                                     <button 
//                                                         class="btn btn-sm btn-info-transparent btn-icon btn-wave" 
//                                                         title="Edit"
//                                                         onclick="handleEditClick(${cell})"
//                                                     >
//                                                         <i class="ri-edit-line"></i>
//                                                     </button>
//                                                     <button 
//                                                         class="btn btn-sm btn-danger-transparent btn-icon btn-wave" 
//                                                         title="Delete"
//                                                         onclick="handleDeleteClick(${cell})"
//                                                     >
//                                                         <i class="ri-delete-bin-line"></i>
//                                                     </button>
//                                                 </div>
//                                             `)
//                                         }
//                                     ]} 
//                                     pagination={{
//                                         limit: 5,
//                                     }}
//                                     className={{
//                                         table: 'table table-bordered',
//                                         search: 'gridjs-search mb-3',
//                                     }}
//                                 />
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Fragment>
//     );
// };



// const MiqaatTable = () => {
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [editData, setEditData] = useState(null);
//     const [tableData, setTableData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch data from API
//     useEffect(() => {
//         fetchMiqaatData();
//     }, []);

//     const fetchMiqaatData = async () => {
//         try {
//             setLoading(true);
//             setError(null);
            
//             const response = await fetch(`${API_BASE_URL}/Miqaat/GetAllMiqaat`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` // Adjust token storage as needed
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
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
//                     reportingTime: extractTime(item.start_date)
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

//     const totalRecords = tableData.length;

//     const handleAdd = () => {
//         setEditData(null);
//         setShowAddForm(true);
//     };

//     const handleCloseModal = () => {
//         setShowAddForm(false);
//         setEditData(null);
//     };

//     const handleSave = async (data) => {
//         console.log('Saved Data:', data);
//         // Refresh data after save
//         await fetchMiqaatData();
//     };

//     // Listen for edit/delete events from Grid.js
//     useEffect(() => {
//         const handleEdit = (e) => {
//             const record = tableData.find(item => item.id === e.detail.id);
//             if (record) {
//                 setEditData(record);
//                 setShowAddForm(true);
//             }
//         };

//         const handleDelete = async (e) => {
//             if (window.confirm('Are you sure you want to delete this record?')) {
//                 try {
//                     // Add your delete API call here
//                     console.log('Delete record:', e.detail.id);
//                     // After successful delete:
//                     await fetchMiqaatData();
//                 } catch (err) {
//                     console.error('Error deleting record:', err);
//                     alert('Failed to delete record: ' + err.message);
//                 }
//             }
//         };

//         window.addEventListener('editRecord', handleEdit);
//         window.addEventListener('deleteRecord', handleDelete);

//         return () => {
//             window.removeEventListener('editRecord', handleEdit);
//             window.removeEventListener('deleteRecord', handleDelete);
//         };
//     }, [tableData]);

//     // Format data for Grid.js
//     const gridData = tableData.map(item => [
//         item.srNo,
//         item.miqaatName,
//         item.miqaatType,
//         item.startDate,
//         item.endDate,
//         item.venue,
//         item.jamaat,
//         item.jamiaat,
//         item.quantity,
//         item.isActive ? 'Active' : 'Inactive',
//         item.reportingTime,
//         item.id
//     ]);

//     return (
//         <Fragment>
//             <style>
//                 {`
//                     /* Search bar styles */
//                     #grid-miqaat-table .gridjs-search {
//                         width: 100%;
//                         margin-bottom: 1rem;
//                     }
//                     #grid-miqaat-table .gridjs-search-input {
//                         width: 100%;
//                     }
//                     #grid-miqaat-table .gridjs-wrapper {
//                         margin-top: 0.5rem;
//                         overflow-x: auto;
//                         -webkit-overflow-scrolling: touch;
//                     }
//                     #grid-miqaat-table .gridjs-table {
//                         min-width: 1600px;
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

//                     /* Loading and Error States */
//                     .loading-state, .error-state {
//                         text-align: center;
//                         padding: 2rem;
//                         color: #6c757d;
//                     }
//                     .error-state {
//                         color: #dc3545;
//                     }
//                 `}
//             </style>

//             {/* AddMiqaat Modal */}
//             {/* <AddMiqaat
//                 show={showAddForm}
//                 onClose={handleCloseModal}
//                 onSave={handleSave}
//                 editData={editData}
//             /> */}

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
//                                 <div className="loading-state">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                     <p className="mt-2">Loading miqaat data...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="error-state">
//                                     <i className="ri-error-warning-line" style={{ fontSize: '2rem' }}></i>
//                                     <p className="mt-2">Error loading data: {error}</p>
//                                     <button 
//                                         className="btn btn-primary btn-sm"
//                                         onClick={fetchMiqaatData}
//                                     >
//                                         Retry
//                                     </button>
//                                 </div>
//                             ) : tableData.length === 0 ? (
//                                 <div className="loading-state">
//                                     <i className="ri-inbox-line" style={{ fontSize: '2rem' }}></i>
//                                     <p className="mt-2">No miqaat records found</p>
//                                 </div>
//                             ) : (
//                                 <div id="grid-miqaat-table">
//                                     <Grid
//                                         data={gridData}
//                                         sort={true}
//                                         search={true}
//                                         columns={[
//                                             { 
//                                                 name: 'Sr. No.',
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
//                                                 width: '120px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Start Date',
//                                                 width: '120px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'End Date',
//                                                 width: '120px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Venue',
//                                                 width: '250px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Jamaat',
//                                                 width: '140px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Jamiaat',
//                                                 width: '180px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Quantity',
//                                                 width: '100px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Is Active',
//                                                 width: '100px',
//                                                 sort: true
//                                             },
//                                             { 
//                                                 name: 'Reporting Time',
//                                                 width: '170px',
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





const MiqaatTable = () => {
    // State management
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editMiqaatId, setEditMiqaatId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state management
    const [modals, setModals] = useState({});
    const [deleteData, setDeleteData] = useState({
        id: null,
        name: ''
    });

    // ✅ Force Grid refresh
    const [gridKey, setGridKey] = useState(0);

    // Delete hook
    const { deleteMiqaat, isDeleting, deleteError, resetDeleteState } = useDeleteMiqaat();

    // Modal handlers
    const handleModalOpen = (modalName) => {
        setModals((prevModals) => ({ ...prevModals, [modalName]: true }));
    };

    const handleModalClose = (modalName) => {
        setModals((prevModals) => ({ ...prevModals, [modalName]: false }));
        if (modalName === 'deleteModal') {
            resetDeleteState();
        }
    };

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
                    reportingTime: extractTime(item.start_date)
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

    // Handle Delete - Show confirmation modal
    const handleDelete = (id) => {
        const miqaatToDelete = tableData.find(item => item.id === id);
        const miqaatName = miqaatToDelete ? miqaatToDelete.miqaatName : 'this miqaat';
        
        setDeleteData({ id, name: miqaatName });
        handleModalOpen('deleteModal');
    };

    // ✅ Confirm Delete - WITH ALL FIXES
    const confirmDelete = async () => {
        const miqaatIdToDelete = deleteData.id;
        
        console.log('Deleting miqaat ID:', miqaatIdToDelete);
        
        const result = await deleteMiqaat(miqaatIdToDelete);
        
        if (result.success) {
            console.log('Delete successful, updating UI...');
            
            // ✅ METHOD 1: Optimistic update - instant UI change
            setTableData(prevData => {
                const filtered = prevData.filter(item => item.id !== miqaatIdToDelete);
                // Recalculate serial numbers
                return filtered.map((item, index) => ({
                    ...item,
                    srNo: index + 1
                }));
            });
            
            // ✅ METHOD 2: Force Grid to re-render
            setGridKey(prev => prev + 1);
            
            // Close modal
            handleModalClose('deleteModal');
            setDeleteData({ id: null, name: '' });
            
            // ✅ METHOD 3: Background sync with server
            setTimeout(async () => {
                try {
                    await fetchMiqaatData();
                    console.log('Table synced with server');
                } catch (error) {
                    console.error('Background sync failed:', error);
                }
            }, 500);
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

    // ✅ Format data for Grid.js with useMemo
    const gridData = useMemo(() => {
        console.log('Recalculating gridData, table length:', tableData.length);
        return tableData.map(item => [
            item.srNo,
            item.miqaatName,
            item.miqaatType,
            item.startDate,
            item.endDate,
            item.venue,
            item.jamaat,
            item.jamiaat,
            item.quantity,
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
                        min-width: 1600px;
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

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                show={modals['deleteModal'] || false}
                onHide={() => handleModalClose('deleteModal')}
                onConfirm={confirmDelete}
                title="Delete Miqaat"
                message="Are you sure you want to delete this miqaat? This will perform a soft delete - the miqaat will be marked as deleted but data remains in the database."
                itemName={deleteData.name}
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="danger"
            />

            {/* AddMiqaat Modal */}
            <AddMiqaat
                show={showAddForm}
                onClose={handleCloseAddModal}
                onSave={handleSave}
            />

            {/* EditMiqaat Modal */}
            {/* <EditMiqaat
                show={showEditForm}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdate}
                miqaatId={editMiqaatId}
            /> */}

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
                                <button 
                                    className="btn btn-sm btn-secondary-transparent"
                                    onClick={fetchMiqaatData}
                                    disabled={loading}
                                    title="Refresh Data"
                                >
                                    <i className="ri-refresh-line"></i>
                                </button>
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
                                                name: 'Sr. No.',
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
                                                width: '120px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Start Date',
                                                width: '120px',
                                                sort: true
                                            },
                                            { 
                                                name: 'End Date',
                                                width: '120px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Venue',
                                                width: '250px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Jamaat',
                                                width: '140px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Jamiaat',
                                                width: '180px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Quantity',
                                                width: '100px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Is Active',
                                                width: '100px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Reporting Time',
                                                width: '170px',
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





const useDeleteMiqaat = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    /**
     * Delete a miqaat by ID
     * @param {number} miqaatId - The ID of the miqaat to delete
     * @returns {Promise<Object>} - Result object with success flag and message
     */
    const deleteMiqaat = async (miqaatId) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            // Get access token from session storage
            const token = sessionStorage.getItem('access_token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsDeleting(false);
                return { success: false, message: 'Authentication token not found' };
            }

            // Validate miqaat ID
            if (!miqaatId) {
                toast.error('Miqaat ID is required');
                setIsDeleting(false);
                return { success: false, message: 'Miqaat ID is required' };
            }

            // API endpoint
            const apiUrl = `${API_BASE_URL}/Miqaat/DeleteMiqaat`;

            console.log('Deleting miqaat:', miqaatId);
            console.log('API URL:', apiUrl);

            // Make DELETE request
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    miqaat_id: miqaatId
                })
            });

            console.log('Delete response status:', response.status);

            // Handle 401 Unauthorized (session expired)
            if (response.status === 401) {
                toast.error('Session expired. Please login again.');
                setDeleteError('Session expired');
                setIsDeleting(false);
                return { success: false, message: 'Session expired' };
            }

            // Check content type before parsing JSON
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response received:', textResponse.substring(0, 200));
                toast.error('Server returned invalid response. Please try again.');
                setDeleteError('Invalid server response');
                setIsDeleting(false);
                return { 
                    success: false, 
                    message: 'Server returned invalid response' 
                };
            }

            // Parse JSON response
            const result = await response.json();
            console.log('Delete result:', result);

            // Check if response is successful
            if (response.ok && result.success) {
                // Handle different result codes
                if (result.data?.result_code === 3) {
                    // Success
                    toast.success('Miqaat deleted successfully!');
                    setIsDeleting(false);
                    return {
                        success: true,
                        message: result.message || 'Miqaat deleted successfully',
                        data: result.data
                    };
                } else if (result.data?.result_code === 0) {
                    // Failure - Miqaat not found or already deleted
                    toast.error('Miqaat not found or already deleted');
                    setDeleteError('Miqaat not found or already deleted');
                    setIsDeleting(false);
                    return {
                        success: false,
                        message: 'Miqaat not found or already deleted'
                    };
                } else {
                    // Unknown result code
                    toast.error(result.message || 'Failed to delete miqaat');
                    setDeleteError(result.message || 'Failed to delete miqaat');
                    setIsDeleting(false);
                    return {
                        success: false,
                        message: result.message || 'Failed to delete miqaat'
                    };
                }
            } else {
                // Response not OK or not successful
                const errorMessage = result.message || result.detail || 'Failed to delete miqaat';
                toast.error(errorMessage);
                setDeleteError(errorMessage);
                setIsDeleting(false);
                return {
                    success: false,
                    message: errorMessage
                };
            }
        } catch (error) {
            console.error('Error deleting miqaat:', error);
            const errorMessage = error.message || 'An error occurred while deleting the miqaat. Please try again.';
            toast.error(errorMessage);
            setDeleteError(errorMessage);
            setIsDeleting(false);
            return {
                success: false,
                message: errorMessage,
                error: error
            };
        }
    };

    /**
     * Reset delete state
     */
    const resetDeleteState = () => {
        setIsDeleting(false);
        setDeleteError(null);
    };

    return {
        deleteMiqaat,
        isDeleting,
        deleteError,
        resetDeleteState
    };
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