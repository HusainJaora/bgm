import { Fragment, useState, useEffect,useMemo } from 'react';
import { Card, Col, Row, Form, Button,Modal, Spinner } from 'react-bootstrap';
import { Grid } from 'gridjs-react';
import { html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import Select from 'react-select';
import IconButton from '../../elements/button'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../../components/common/modalcloses/confirmdelete'
import SuccessToaster from '../../../components/common/modalcloses/success';


// API Base URL Configuration
const API_BASE_URL = 'http://13.204.161.209:8080/BURHANI_GUARDS_API_TEST/api';

// const AddJamaat = ({ 
//     show,
//     onClose,
//     onSave,
//     editData = null,
//     title = "Add New Team"
// }) => {
    
//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         jamiaat: null,
//         jamaat: []
//     });

//     // Validation errors state
//     const [errors, setErrors] = useState({
//         name: '',
//         jamiaat: '',
//         jamaat: ''
//     });

//     // Loading states
//     const [isLoading, setIsLoading] = useState(false);
//     const [isLoadingJamiaats, setIsLoadingJamiaats] = useState(false);
//     const [isLoadingJamaats, setIsLoadingJamaats] = useState(false);

//     // Options state
//     const [jamiaatOptions, setJamiaatOptions] = useState([]);
//     const [jamaatOptions, setJamaatOptions] = useState([]);

//     // Fetch all Jamiaats on component mount
//     useEffect(() => {
//         if (show) {
//             fetchAllJamiaats();
//         }
//     }, [show]);

//     // Fetch Jamiaats from API
//     const fetchAllJamiaats = async () => {
//         setIsLoadingJamiaats(true);
//         try {
//             const token = sessionStorage.getItem('access_token');
            
//             if (!token) {
//                 toast.error('Authentication token not found. Please login again.');
//                 setIsLoadingJamiaats(false);
//                 return;
//             }
            
//             const response = await fetch(`${API_BASE_URL}/Team/GetAllJamiaats`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             const result = await response.json();

//             if (response.status === 401) {
//                 toast.error('Session expired. Please login again.');
//                 return;
//             }

//             if (response.ok && result.success) {
//                 const options = result.data.map(item => ({
//                     value: item.jamiaat_id,
//                     label: item.jamiaat_name
//                 }));
//                 setJamiaatOptions(options);
//             } else {
//                 toast.error(result.message || 'Failed to load Jamiaats');
//             }
//         } catch (error) {
//             console.error('Error fetching Jamiaats:', error);
//             toast.error('Error loading Jamiaats. Please try again.');
//         } finally {
//             setIsLoadingJamiaats(false);
//         }
//     };

//     // Fetch Jamaats based on selected Jamiaat
//     const fetchJamaatsByJamiaat = async (jamiaatId) => {
//         setIsLoadingJamaats(true);
//         setJamaatOptions([]);
        
//         try {
//             const token = sessionStorage.getItem('access_token');
            
//             if (!token) {
//                 toast.error('Authentication token not found. Please login again.');
//                 setIsLoadingJamaats(false);
//                 return;
//             }
            
//             const response = await fetch(`${API_BASE_URL}/Team/GetAllJamaatsByJamiaat`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     jamiaat_id: jamiaatId
//                 })
//             });

//             const result = await response.json();

//             if (response.status === 401) {
//                 toast.error('Session expired. Please login again.');
//                 return;
//             }

//             if (response.ok && result.success) {
//                 const options = result.data.map(item => ({
//                     value: item.jamaat_id,
//                     label: item.jamaat_name
//                 }));
//                 setJamaatOptions(options);
//             } else {
//                 toast.error(result.message || 'Failed to load Jamaats for selected Jamiaat');
//                 setJamaatOptions([]);
//             }
//         } catch (error) {
//             console.error('Error fetching Jamaats:', error);
//             toast.error('Error loading Jamaats. Please try again.');
//             setJamaatOptions([]);
//         } finally {
//             setIsLoadingJamaats(false);
//         }
//     };

//     // Populate form when editing
//     useEffect(() => {
//         if (editData && show) {
//             setFormData({
//                 name: editData.name || '',
//                 jamiaat: editData.jamiaat || null,
//                 jamaat: editData.jamaat || []
//             });
//             setErrors({ name: '', jamiaat: '', jamaat: '' });
            
//             if (editData.jamiaat?.value) {
//                 fetchJamaatsByJamiaat(editData.jamiaat.value);
//             }
//         } else if (!editData && show) {
//             handleClear();
//         }
//     }, [editData, show]);

//     // Handle form input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }
//     };

//     // Handle Jamiaat select change
//     const handlejamiaatChange = (selectedOption) => {
//         setFormData(prev => ({
//             ...prev,
//             jamiaat: selectedOption,
//             jamaat: []
//         }));
        
//         if (errors.jamiaat) {
//             setErrors(prev => ({
//                 ...prev,
//                 jamiaat: ''
//             }));
//         }
        
//         if (selectedOption?.value) {
//             fetchJamaatsByJamiaat(selectedOption.value);
//         } else {
//             setJamaatOptions([]);
//         }
//     };

//     // Handle Jamaat select change
//     const handleJamaatChange = (selectedOptions) => {
//         setFormData(prev => ({
//             ...prev,
//             jamaat: selectedOptions || []
//         }));
//         if (errors.jamaat) {
//             setErrors(prev => ({
//                 ...prev,
//                 jamaat: ''
//             }));
//         }
//     };

//     // Validate form
//     const validateForm = () => {
//         const newErrors = {
//             name: '',
//             jamiaat: '',
//             jamaat: ''
//         };

//         let isValid = true;

//         if (!formData.name.trim()) {
//             newErrors.name = 'Name is required';
//             isValid = false;
//         }

//         if (!formData.jamiaat) {
//             newErrors.jamiaat = 'Jamiaat is required';
//             isValid = false;
//         }

//         if (!formData.jamaat || formData.jamaat.length === 0) {
//             newErrors.jamaat = 'At least one Jamaat must be selected';
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };

//     // Handle Save
//     const handleSave = async () => {
//         if (!validateForm()) {
//             toast.error('Please fill in all required fields');
//             return;
//         }

//         setIsLoading(true);
//         // console.log("Save button")

//         try {
//             const token = sessionStorage.getItem('access_token');
          

//             if (!token) {
//                 toast.error('Authentication token not found. Please login again.');
//                 setIsLoading(false);
//                 return;
//             }

//             const payload = {
//                 team_name: formData.name.trim(),
//                 jamiaat_id: formData.jamiaat.value,
//                 jamaat_ids: formData.jamaat.map(j => j.value)
//             };
//             const response = await fetch(`${API_BASE_URL}/Team/InsertTeam`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(payload)
//             });

//             const result = await response.json();

//   console.log("Save button :"+JSON.stringify(payload))
//             if (response.status === 401) {
//                 toast.error('Session expired. Please login again.');
//                 return;
//             }

//             if (response.ok && result.success) {
//                 if (result.data?.result_code === 1) {
//                     toast.success('Team added successfully!');
                    
//                     if (onSave) {
//                         const dataToSave = {
//                             name: formData.name,
//                             jamiaatId: formData.jamiaat.value,
//                             jamiaatName: formData.jamiaat.label,
//                             jamaatIds: formData.jamaat.map(j => j.value),
//                             jamaatNames: formData.jamaat.map(j => j.label),
//                             jamiaat: formData.jamiaat,
//                             jamaat: formData.jamaat
//                         };
//                         onSave(dataToSave);
                        
//                     }
                    
//                     handleClose();
//                 } else if (result.data?.result_code === 4) {
//                     setErrors(prev => ({
//                         ...prev,
//                         name: 'Team name already exists'
//                     }));
//                     toast.error('Team name already exists');
//                 } else if (result.data?.result_code === 5) {
//                     setErrors(prev => ({
//                         ...prev,
//                         jamaat: 'No jamaat IDs provided'
//                     }));
//                     toast.error('Please select at least one Jamaat');
//                 } else {
//                     toast.error(result.message || 'Failed to add team');
//                 }
//             } else {
//                 toast.error(result.message || 'Failed to add team');
//             }
//         } catch (error) {
//             console.error('Error saving team:', error);
//             toast.error('An error occurred while saving the team. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handle Close
//     const handleClose = () => {
//         handleClear();
//         if (onClose) {
//             onClose();
//         }
//     };

//     // Handle Clear
//     const handleClear = () => {
//         setFormData({
//             name: '',
//             jamiaat: null,
//             jamaat: []
//         });
//         setErrors({
//             name: '',
//             jamiaat: '',
//             jamaat: ''
//         });
//         setJamaatOptions([]);
//     };

//     // Custom styles for react-select
//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             minHeight: '42px',
//             borderColor: state.isFocused 
//                 ? '#80bdff' 
//                 : (errors.jamiaat || errors.jamaat) 
//                     ? '#dc3545' 
//                     : '#ced4da',
//             borderRadius: '0.375rem',
//             boxShadow: state.isFocused 
//                 ? '0 0 0 0.2rem rgba(13,110,253,.25)' 
//                 : 'none',
//             '&:hover': {
//                 borderColor: state.isFocused ? '#80bdff' : '#adb5bd'
//             }
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: '#6c757d',
//             fontSize: '0.875rem'
//         }),
//         multiValue: (base) => ({
//             ...base,
//             backgroundColor: '#e7f1ff',
//             borderRadius: '0.25rem'
//         }),
//         multiValueLabel: (base) => ({
//             ...base,
//             color: '#0d6efd',
//             fontSize: '0.875rem'
//         }),
//         multiValueRemove: (base) => ({
//             ...base,
//             color: '#0d6efd',
//             borderRadius: '0 0.25rem 0.25rem 0',
//             '&:hover': {
//                 backgroundColor: '#0d6efd',
//                 color: '#fff',
//             }
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: '0.375rem',
//             boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
//         })
//     };

//     return (
//         <Modal 
//             show={show} 
//             onHide={handleClose} 
//             centered 
//             size="lg"
//             backdrop="static"
//         >
//             <Modal.Header 
//                 style={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     color: 'white',
//                     border: 'none',
//                     padding: '1.25rem 1.5rem'
//                 }}
//             >
//                 <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.25rem' }}>
//                     <i className={`ri-${editData ? 'edit' : 'add-circle'}-line`} style={{ fontSize: '1.5rem' }}></i>
//                     <span>{editData ? 'Edit Team' : title}</span>
//                 </Modal.Title>
//                 <button 
//                     type="button" 
//                     className="btn-close btn-close-white"
//                     onClick={handleClose}
//                     style={{
//                         opacity: 0.8,
//                         filter: 'brightness(0) invert(1)'
//                     }}
//                 ></button>
//             </Modal.Header>

//             <Modal.Body style={{ padding: '1.75rem' }}>
//                 {/* Row 1: Name and Jamiaat */}
//                 <div className="row g-3 mb-3">
//                     <div className="col-md-6">
//                         <Form.Group>
//                             <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
//                                 Team Name <span className="text-danger">*</span>
//                             </Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter team name"
//                                 isInvalid={!!errors.name}
//                                 disabled={isLoading}
//                                 style={{ 
//                                     height: '42px',
//                                     fontSize: '0.875rem'
//                                 }}
//                             />
//                             <Form.Control.Feedback type="invalid" style={{ fontSize: '0.813rem' }}>
//                                 {errors.name}
//                             </Form.Control.Feedback>
//                         </Form.Group>
//                     </div>

//                     <div className="col-md-6">
//                         <Form.Group>
//                             <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
//                                 Jamiaat <span className="text-danger">*</span>
//                             </Form.Label>
//                             <Select
//                                 options={jamiaatOptions}
//                                 value={formData.jamiaat}
//                                 onChange={handlejamiaatChange}
//                                 placeholder="Select jamiaat"
//                                 isClearable
//                                 isDisabled={isLoading || isLoadingJamiaats}
//                                 isLoading={isLoadingJamiaats}
//                                 styles={selectStyles}
//                                 noOptionsMessage={() => "No jamiaats available"}
//                             />
//                             {errors.jamiaat && (
//                                 <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
//                                     {errors.jamiaat}
//                                 </div>
//                             )}
//                         </Form.Group>
//                     </div>
//                 </div>

//                 {/* Row 2: Jamaat */}
//                 <div className="row g-3">
//                     <div className="col-12">
//                         <Form.Group>
//                             <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
//                                 Jamaat <span className="text-danger">*</span>
//                             </Form.Label>
//                             <Select
//                                 options={jamaatOptions}
//                                 value={formData.jamaat}
//                                 onChange={handleJamaatChange}
//                                 placeholder={
//                                     !formData.jamiaat 
//                                         ? "First select a jamiaat" 
//                                         : isLoadingJamaats 
//                                             ? "Loading jamaats..." 
//                                             : "Select jamaat (multiple)"
//                                 }
//                                 isMulti
//                                 isClearable
//                                 isDisabled={isLoading || !formData.jamiaat || isLoadingJamaats}
//                                 isLoading={isLoadingJamaats}
//                                 styles={selectStyles}
//                                 noOptionsMessage={() => 
//                                     !formData.jamiaat 
//                                         ? "Please select a jamiaat first" 
//                                         : "No jamaats available for selected jamiaat"
//                                 }
//                             />
//                             {errors.jamaat && (
//                                 <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
//                                     {errors.jamaat}
//                                 </div>
//                             )}
//                         </Form.Group>
//                     </div>
//                 </div>
//             </Modal.Body>

//             <Modal.Footer 
//                 className="justify-content-center gap-2" 
//                 style={{ 
//                     backgroundColor: '#f8f9fa',
//                     borderTop: '1px solid #e9ecef',
//                     padding: '1.25rem 1.5rem'
//                 }}
//             >
//                 <Button 
//                     variant="primary"
//                     onClick={handleSave}
//                     disabled={isLoading}
//                     className="d-flex align-items-center gap-2"
//                     style={{ 
//                         minWidth: '110px',
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         border: 'none',
//                         fontWeight: '500',
//                         fontSize: '0.875rem'
//                     }}
//                 >
//                     {isLoading ? (
//                         <>
//                             <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                             Saving...
//                         </>
//                     ) : (
//                         <>
//                             <i className="ri-save-line"></i>
//                             Save
//                         </>
//                     )}
//                 </Button>
//                 <Button 
//                     variant="secondary"
//                     onClick={handleClose}
//                     disabled={isLoading}
//                     className="d-flex align-items-center gap-2"
//                     style={{ 
//                         minWidth: '110px',
//                         fontWeight: '500',
//                         fontSize: '0.875rem'
//                     }}
//                 >
//                     <i className="ri-arrow-left-line"></i>
//                     Back
//                 </Button>
//                 <Button 
//                     variant="light"
//                     onClick={handleClear}
//                     disabled={isLoading}
//                     className="d-flex align-items-center gap-2"
//                     style={{ 
//                         minWidth: '110px',
//                         backgroundColor: '#e9ecef',
//                         border: '1px solid #dee2e6',
//                         color: '#495057',
//                         fontWeight: '500',
//                         fontSize: '0.875rem'
//                     }}
//                 >
//                     <i className="ri-refresh-line"></i>
//                     Clear
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };


const AddJamaat = ({ 
    show,
    onClose,
    onSave,
    editData = null,
    title = "Add New Team"
}) => {
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        jamiaat: null,
        jamaat: []
    });

    // Validation errors state
    const [errors, setErrors] = useState({
        name: '',
        jamiaat: '',
        jamaat: ''
    });

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingJamiaats, setIsLoadingJamiaats] = useState(false);
    const [isLoadingJamaats, setIsLoadingJamaats] = useState(false);

    // Options state
    const [jamiaatOptions, setJamiaatOptions] = useState([]);
    const [jamaatOptions, setJamaatOptions] = useState([]);

    // Fetch all Jamiaats on component mount
    useEffect(() => {
        if (show) {
            fetchAllJamiaats();
        }
    }, [show]);

    // Fetch Jamiaats from API
    const fetchAllJamiaats = async () => {
        setIsLoadingJamiaats(true);
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
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
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamiaat_id,
                    label: item.jamiaat_name
                }));
                setJamiaatOptions(options);
            } else {
                toast.error(result.message || 'Failed to load Jamiaats');
            }
        } catch (error) {
            console.error('Error fetching Jamiaats:', error);
            toast.error('Error loading Jamiaats. Please try again.');
        } finally {
            setIsLoadingJamiaats(false);
        }
    };

    // Fetch Jamaats based on selected Jamiaat
    const fetchJamaatsByJamiaat = async (jamiaatId) => {
        setIsLoadingJamaats(true);
        setJamaatOptions([]);
        
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsLoadingJamaats(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Team/GetAllJamaatsByJamiaat`, {
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
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamaat_id,
                    label: item.jamaat_name
                }));
                setJamaatOptions(options);
            } else {
                toast.error(result.message || 'Failed to load Jamaats for selected Jamiaat');
                setJamaatOptions([]);
            }
        } catch (error) {
            console.error('Error fetching Jamaats:', error);
            toast.error('Error loading Jamaats. Please try again.');
            setJamaatOptions([]);
        } finally {
            setIsLoadingJamaats(false);
        }
    };

    // Populate form when editing
    useEffect(() => {
        if (editData && show) {
            setFormData({
                name: editData.name || '',
                jamiaat: editData.jamiaat || null,
                jamaat: editData.jamaat || []
            });
            setErrors({ name: '', jamiaat: '', jamaat: '' });
            
            if (editData.jamiaat?.value) {
                fetchJamaatsByJamiaat(editData.jamiaat.value);
            }
        } else if (!editData && show) {
            handleClear();
        }
    }, [editData, show]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle Jamiaat select change
    const handlejamiaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            jamiaat: selectedOption,
            jamaat: []
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

    // Handle Jamaat select change
    const handleJamaatChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            jamaat: selectedOptions || []
        }));
        if (errors.jamaat) {
            setErrors(prev => ({
                ...prev,
                jamaat: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {
            name: '',
            jamiaat: '',
            jamaat: ''
        };

        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Jamiaat is required';
            isValid = false;
        }

        if (!formData.jamaat || formData.jamaat.length === 0) {
            newErrors.jamaat = 'At least one Jamaat must be selected';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle Save
    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('access_token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsLoading(false);
                return;
            }

            const payload = {
                team_name: formData.name.trim(),
                jamiaat_id: formData.jamiaat.value,
                jamaat_ids: formData.jamaat.map(j => j.value)
            };
            
            const response = await fetch(`${API_BASE_URL}/Team/InsertTeam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            console.log("Save button: " + JSON.stringify(payload));
            
            if (response.status === 401) {
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                if (result.data?.result_code === 1) {
                    // Close modal first
                    handleClose();
                    
                    // Show single success toast after modal closes
                    toast.success('Team added successfully!');
                    
                    // Trigger callback to refresh the table/redirect
                    if (onSave) {
                        const dataToSave = {
                            name: formData.name,
                            jamiaatId: formData.jamiaat.value,
                            jamiaatName: formData.jamiaat.label,
                            jamaatIds: formData.jamaat.map(j => j.value),
                            jamaatNames: formData.jamaat.map(j => j.label),
                            jamiaat: formData.jamiaat,
                            jamaat: formData.jamaat
                        };
                        onSave(dataToSave);
                    }
                } else if (result.data?.result_code === 4) {
                    setErrors(prev => ({
                        ...prev,
                        name: 'Team name already exists'
                    }));
                    toast.error('Team name already exists');
                } else if (result.data?.result_code === 5) {
                    setErrors(prev => ({
                        ...prev,
                        jamaat: 'No jamaat IDs provided'
                    }));
                    toast.error('Please select at least one Jamaat');
                } else {
                    toast.error(result.message || 'Failed to add team');
                }
            } else {
                toast.error(result.message || 'Failed to add team');
            }
        } catch (error) {
            console.error('Error saving team:', error);
            toast.error('An error occurred while saving the team. Please try again.');
        } finally {
            setIsLoading(false);
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
            name: '',
            jamiaat: null,
            jamaat: []
        });
        setErrors({
            name: '',
            jamiaat: '',
            jamaat: ''
        });
        setJamaatOptions([]);
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderColor: state.isFocused 
                ? '#80bdff' 
                : (errors.jamiaat || errors.jamaat) 
                    ? '#dc3545' 
                    : '#ced4da',
            borderRadius: '0.375rem',
            boxShadow: state.isFocused 
                ? '0 0 0 0.2rem rgba(13,110,253,.25)' 
                : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#80bdff' : '#adb5bd'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6c757d',
            fontSize: '0.875rem'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#e7f1ff',
            borderRadius: '0.25rem'
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#0d6efd',
            fontSize: '0.875rem'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#0d6efd',
            borderRadius: '0 0.25rem 0.25rem 0',
            '&:hover': {
                backgroundColor: '#0d6efd',
                color: '#fff',
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
        })
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            centered 
            size="lg"
            backdrop="static"
        >
            <Modal.Header 
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem 1.5rem'
                }}
            >
                <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.25rem' }}>
                    <i className={`ri-${editData ? 'edit' : 'add-circle'}-line`} style={{ fontSize: '1.5rem' }}></i>
                    <span>{editData ? 'Edit Team' : title}</span>
                </Modal.Title>
                <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={handleClose}
                    style={{
                        opacity: 0.8,
                        filter: 'brightness(0) invert(1)'
                    }}
                ></button>
            </Modal.Header>

            <Modal.Body style={{ padding: '1.75rem' }}>
                {/* Row 1: Name and Jamiaat */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <Form.Group>
                            <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                Team Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter team name"
                                isInvalid={!!errors.name}
                                disabled={isLoading}
                                style={{ 
                                    height: '42px',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <Form.Control.Feedback type="invalid" style={{ fontSize: '0.813rem' }}>
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group>
                            <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                Jamiaat <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                                options={jamiaatOptions}
                                value={formData.jamiaat}
                                onChange={handlejamiaatChange}
                                placeholder="Select jamiaat"
                                isClearable
                                isDisabled={isLoading || isLoadingJamiaats}
                                isLoading={isLoadingJamiaats}
                                styles={selectStyles}
                                noOptionsMessage={() => "No jamiaats available"}
                            />
                            {errors.jamiaat && (
                                <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
                                    {errors.jamiaat}
                                </div>
                            )}
                        </Form.Group>
                    </div>
                </div>

                {/* Row 2: Jamaat */}
                <div className="row g-3">
                    <div className="col-12">
                        <Form.Group>
                            <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                Jamaat <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                                options={jamaatOptions}
                                value={formData.jamaat}
                                onChange={handleJamaatChange}
                                placeholder={
                                    !formData.jamiaat 
                                        ? "First select a jamiaat" 
                                        : isLoadingJamaats 
                                            ? "Loading jamaats..." 
                                            : "Select jamaat (multiple)"
                                }
                                isMulti
                                isClearable
                                isDisabled={isLoading || !formData.jamiaat || isLoadingJamaats}
                                isLoading={isLoadingJamaats}
                                styles={selectStyles}
                                noOptionsMessage={() => 
                                    !formData.jamiaat 
                                        ? "Please select a jamiaat first" 
                                        : "No jamaats available for selected jamiaat"
                                }
                            />
                            {errors.jamaat && (
                                <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
                                    {errors.jamaat}
                                </div>
                            )}
                        </Form.Group>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer 
                className="justify-content-center gap-2" 
                style={{ 
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef',
                    padding: '1.25rem 1.5rem'
                }}
            >
                <Button 
                    variant="primary"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-save-line"></i>
                            Save
                        </>
                    )}
                </Button>
                <Button 
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    <i className="ri-arrow-left-line"></i>
                    Back
                </Button>
                <Button 
                    variant="light"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        backgroundColor: '#e9ecef',
                        border: '1px solid #dee2e6',
                        color: '#495057',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    <i className="ri-refresh-line"></i>
                    Clear
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const EditJamaat = ({ 
    show, 
    onClose, 
    onUpdate, 
    teamId,
    title = "Edit Team"
}) => {
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        jamiaat: null,
        jamaat: []
    });

    // Validation errors state
    const [errors, setErrors] = useState({
        name: '',
        jamiaat: '',
        jamaat: ''
    });

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTeamData, setIsLoadingTeamData] = useState(false);
    const [isLoadingJamiaats, setIsLoadingJamiaats] = useState(false);
    const [isLoadingJamaats, setIsLoadingJamaats] = useState(false);

    // Options state
    const [jamiaatOptions, setJamiaatOptions] = useState([]);
    const [jamaatOptions, setJamaatOptions] = useState([]);

    // Original data for comparison
    const [originalData, setOriginalData] = useState(null);

    // Fetch team data by ID when component shows
    useEffect(() => {
        if (show && teamId) {
            fetchTeamData(teamId);
            fetchAllJamiaats();
        }
    }, [show, teamId]);

    // Fetch Team Data by ID
    const fetchTeamData = async (id) => {
        setIsLoadingTeamData(true);
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsLoadingTeamData(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Team/GetTeamById`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    team_id: id
                })
            });

            const result = await response.json();

            if (response.status === 401) {
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success && result.data && result.data.length > 0) {
                const teamData = result.data[0];
                
                const jamiaatObj = {
                    value: teamData.jamiaat_id,
                    label: teamData.jamiaat_name
                };

                const initialFormData = {
                    name: teamData.team_name || '',
                    jamiaat: jamiaatObj,
                    jamaat: [] // Will be populated by fetchJamaatsByJamiaat
                };

                setFormData(initialFormData);
                setOriginalData(initialFormData);

                // Fetch jamaats for the selected jamiaat and then load team's jamaats
                if (teamData.jamiaat_id) {
                    await fetchJamaatsByJamiaat(teamData.jamiaat_id, teamData.team_id);
                }
            } else {
                toast.error(result.message || 'Failed to load team data');
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
            toast.error('Error loading team data. Please try again.');
        } finally {
            setIsLoadingTeamData(false);
        }
    };

    // Fetch all Jamiaats
    const fetchAllJamiaats = async () => {
        setIsLoadingJamiaats(true);
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
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
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamiaat_id,
                    label: item.jamiaat_name
                }));
                setJamiaatOptions(options);
            } else {
                toast.error(result.message || 'Failed to load Jamiaats');
            }
        } catch (error) {
            console.error('Error fetching Jamiaats:', error);
            toast.error('Error loading Jamiaats. Please try again.');
        } finally {
            setIsLoadingJamiaats(false);
        }
    };

    // Fetch Jamaats based on selected Jamiaat and prefill selected jamaats for the team
    const fetchJamaatsByJamiaat = async (jamiaatId, currentTeamId = null) => {
        setIsLoadingJamaats(true);
        
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsLoadingJamaats(false);
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Team/GetAllJamaatsByJamiaat`, {
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
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                const options = result.data.map(item => ({
                    value: item.jamaat_id,
                    label: item.jamaat_name
                }));
                setJamaatOptions(options);

                // If loading initial team data, fetch and prefill selected jamaats
                if (currentTeamId) {
                    await fetchTeamJamaats(currentTeamId);
                }
            } else {
                toast.error(result.message || 'Failed to load Jamaats for selected Jamiaat');
                setJamaatOptions([]);
            }
        } catch (error) {
            console.error('Error fetching Jamaats:', error);
            toast.error('Error loading Jamaats. Please try again.');
            setJamaatOptions([]);
        } finally {
            setIsLoadingJamaats(false);
        }
    };

    // Fetch jamaats associated with the team (for prefilling)
    const fetchTeamJamaats = async (teamId) => {
        try {
            const token = sessionStorage.getItem('access_token');
            
            if (!token) {
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/Team/GetJamaatsByTeamId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    team_id: teamId
                })
            });

            const result = await response.json();

            if (response.ok && result.success && result.data) {
                const selectedJamaats = result.data.map(item => ({
                    value: item.jamaat_id,
                    label: item.jamaat_name
                }));

                setFormData(prev => ({
                    ...prev,
                    jamaat: selectedJamaats
                }));

                setOriginalData(prev => ({
                    ...prev,
                    jamaat: selectedJamaats
                }));
            }
        } catch (error) {
            console.error('Error fetching team jamaats:', error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle Jamiaat select change
    const handlejamiaatChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            jamiaat: selectedOption,
            jamaat: [] // Clear jamaats when jamiaat changes
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

    // Handle Jamaat select change
    const handleJamaatChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            jamaat: selectedOptions || []
        }));
        
        if (errors.jamaat) {
            setErrors(prev => ({
                ...prev,
                jamaat: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {
            name: '',
            jamiaat: '',
            jamaat: ''
        };

        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Team name is required';
            isValid = false;
        }

        if (!formData.jamiaat) {
            newErrors.jamiaat = 'Jamiaat is required';
            isValid = false;
        }

        if (!formData.jamaat || formData.jamaat.length === 0) {
            newErrors.jamaat = 'At least one Jamaat must be selected';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Check if form has changes
    const hasChanges = () => {
        if (!originalData) return false;

        const nameChanged = formData.name !== originalData.name;
        const jamiaatChanged = formData.jamiaat?.value !== originalData.jamiaat?.value;
        
        const currentJamaatIds = formData.jamaat.map(j => j.value).sort();
        const originalJamaatIds = (originalData.jamaat || []).map(j => j.value).sort();
        const jamaatChanged = JSON.stringify(currentJamaatIds) !== JSON.stringify(originalJamaatIds);

        return nameChanged || jamiaatChanged || jamaatChanged;
    };

    // Handle Update using PUT API
    const handleUpdate = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!hasChanges()) {
            
            return;
        }

        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('access_token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsLoading(false);
                return;
            }

            const payload = {
                team_id: teamId,
                team_name: formData.name.trim(),
                jamiaat_id: formData.jamiaat.value,
                jamaat_ids: formData.jamaat.map(j => j.value)
            };

            const response = await fetch(`${API_BASE_URL}/Team/UpdateTeam`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.status === 401) {
                toast.error('Session expired. Please login again.');
                return;
            }

            if (response.ok && result.success) {
                toast.success('Team updated successfully!');
                
                if (onUpdate) {
                    const dataToUpdate = {
                        team_id: teamId,
                        name: formData.name,
                        jamiaatId: formData.jamiaat.value,
                        jamiaatName: formData.jamiaat.label,
                        jamaatIds: formData.jamaat.map(j => j.value),
                        jamaatNames: formData.jamaat.map(j => j.label),
                        jamiaat: formData.jamiaat,
                        jamaat: formData.jamaat
                    };
                    onUpdate(dataToUpdate);
                }
                
                handleClose();
            } else {
                if (result.data?.result_code === 4) {
                    setErrors(prev => ({
                        ...prev,
                        name: 'Team name already exists'
                    }));
                    toast.error('Team name already exists');
                } else if (result.data?.result_code === 0) {
                    toast.error('Team not found or update failed');
                } else {
                    toast.error(result.message || 'Failed to update team');
                }
            }
        } catch (error) {
            console.error('Error updating team:', error);
            toast.error('An error occurred while updating the team. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Close
    const handleClose = () => {
        setFormData({
            name: '',
            jamiaat: null,
            jamaat: []
        });
        setErrors({
            name: '',
            jamiaat: '',
            jamaat: ''
        });
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
            setErrors({
                name: '',
                jamiaat: '',
                jamaat: ''
            });
            toast.info('Form reset to original values');
        }
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderColor: state.isFocused 
                ? '#80bdff' 
                : (errors.jamiaat || errors.jamaat) 
                    ? '#dc3545' 
                    : '#ced4da',
            borderRadius: '0.375rem',
            boxShadow: state.isFocused 
                ? '0 0 0 0.2rem rgba(13,110,253,.25)' 
                : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#80bdff' : '#adb5bd'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6c757d',
            fontSize: '0.875rem'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#e7f1ff',
            borderRadius: '0.25rem'
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#0d6efd',
            fontSize: '0.875rem'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#0d6efd',
            borderRadius: '0 0.25rem 0.25rem 0',
            '&:hover': {
                backgroundColor: '#0d6efd',
                color: '#fff',
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
        })
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            centered 
            size="lg"
            backdrop="static"
        >
            <Modal.Header 
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem 1.5rem'
                }}
            >
                <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.25rem' }}>
                    <i className="ri-edit-line" style={{ fontSize: '1.5rem' }}></i>
                    <span>{title}</span>
                </Modal.Title>
                <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={handleClose}
                    style={{
                        opacity: 0.8,
                        filter: 'brightness(0) invert(1)'
                    }}
                ></button>
            </Modal.Header>

            <Modal.Body style={{ padding: '1.75rem' }}>
                {isLoadingTeamData ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3 text-muted">Loading team data...</p>
                    </div>
                ) : (
                    <>
                        {/* Row 1: Name and Jamiaat */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                        Team Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter team name"
                                        isInvalid={!!errors.name}
                                        disabled={isLoading}
                                        style={{ 
                                            height: '42px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.813rem' }}>
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                        Jamiaat <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Select
                                        options={jamiaatOptions}
                                        value={formData.jamiaat}
                                        onChange={handlejamiaatChange}
                                        placeholder="Select jamiaat"
                                        isClearable
                                        isDisabled={isLoading || isLoadingJamiaats}
                                        isLoading={isLoadingJamiaats}
                                        styles={selectStyles}
                                        noOptionsMessage={() => "No jamiaats available"}
                                    />
                                    {errors.jamiaat && (
                                        <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
                                            {errors.jamiaat}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        </div>

                        {/* Row 2: Jamaat */}
                        <div className="row g-3">
                            <div className="col-12">
                                <Form.Group>
                                    <Form.Label className="fw-medium" style={{ fontSize: '0.875rem', color: '#495057' }}>
                                        Jamaat <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Select
                                        options={jamaatOptions}
                                        value={formData.jamaat}
                                        onChange={handleJamaatChange}
                                        placeholder={
                                            !formData.jamiaat 
                                                ? "First select a jamiaat" 
                                                : isLoadingJamaats 
                                                    ? "Loading jamaats..." 
                                                    : "Select jamaat (multiple)"
                                        }
                                        isMulti
                                        isClearable
                                        isDisabled={isLoading || !formData.jamiaat || isLoadingJamaats}
                                        isLoading={isLoadingJamaats}
                                        styles={selectStyles}
                                        noOptionsMessage={() => 
                                            !formData.jamiaat 
                                                ? "Please select a jamiaat first" 
                                                : "No jamaats available for selected jamiaat"
                                        }
                                    />
                                    {errors.jamaat && (
                                        <div className="invalid-feedback d-block" style={{ fontSize: '0.813rem' }}>
                                            {errors.jamaat}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        </div>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer 
                className="justify-content-center gap-2" 
                style={{ 
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef',
                    padding: '1.25rem 1.5rem'
                }}
            >
                <Button 
                    variant="primary"
                    onClick={handleUpdate}
                    disabled={isLoading || !hasChanges() || isLoadingTeamData}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Updating...
                        </>
                    ) : (
                        <>
                            <i className="ri-save-line"></i>
                            Update
                        </>
                    )}
                </Button>
                <Button 
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    <i className="ri-arrow-left-line"></i>
                    Back
                </Button>
                <Button 
                    variant="light"
                    onClick={handleReset}
                    disabled={isLoading || !hasChanges() || isLoadingTeamData}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                        minWidth: '110px',
                        backgroundColor: '#e9ecef',
                        border: '1px solid #dee2e6',
                        color: '#495057',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    <i className="ri-refresh-line"></i>
                    Reset
                </Button>
            </Modal.Footer>
        </Modal>
    );
};



const TeamTable = () => {
    // State management
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTeamId, setEditTeamId] = useState(null);
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
    const { deleteTeam, isDeleting, deleteError, resetDeleteState } = useDeleteTeam();

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

    // Fetch teams data from API
    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                throw new Error('Access token not found. Please login again.');
            }

            const apiUrl = `${API_BASE_URL}/Team/GetAllTeams`;

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
                const transformedData = result.data.map((item, index) => ({
                    id: item.team_id,
                    srNo: index + 1,
                    teamName: item.team_name,
                    jamiaat: item.jamiaat_name,
                    jamiaatId: item.jamiaat_id
                }));
                setTableData(transformedData);
            } else {
                throw new Error(result.message || 'Failed to fetch teams');
            }
        } catch (err) {
            console.error('Error fetching teams:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchTeams();
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
        setEditTeamId(null);
    };

    // Handle Save (for Add)
    const handleSave = (data) => {
        console.log('Saved Data:', data);
        setShowAddForm(false);
        
        // Refresh the table
        fetchTeams();
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
    };

    // Handle Update (for Edit)
    const handleUpdate = (data) => {
        console.log('Updated Data:', data);
        setShowEditForm(false);
        setEditTeamId(null);
        
        // Optimistic update - update the specific row in the table
        setTableData(prevData => {
            return prevData.map(item => {
                if (item.id === data.team_id) {
                    return {
                        ...item,
                        teamName: data.name,
                        jamiaat: data.jamiaatName,
                        jamiaatId: data.jamiaatId
                    };
                }
                return item;
            });
        });
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
        
        // Background sync with server
        setTimeout(() => {
            fetchTeams();
        }, 500);
    };

    // Handle Edit
    const handleEdit = (id) => {
        console.log('Editing team ID:', id);
        setEditTeamId(id);
        setShowEditForm(true);
    };

    // Handle Delete - Show confirmation modal
    const handleDelete = (id) => {
        const teamToDelete = tableData.find(item => item.id === id);
        const teamName = teamToDelete ? teamToDelete.teamName : 'this team';
        
        setDeleteData({ id, name: teamName });
        handleModalOpen('deleteModal');
    };

    // ✅ Confirm Delete - WITH ALL FIXES
    const confirmDelete = async () => {
        const teamIdToDelete = deleteData.id;
        
        console.log('Deleting team ID:', teamIdToDelete);
        
        const result = await deleteTeam(teamIdToDelete);
        
        if (result.success) {
            console.log('Delete successful, updating UI...');
            
            // ✅ METHOD 1: Optimistic update - instant UI change
            setTableData(prevData => {
                const filtered = prevData.filter(item => item.id !== teamIdToDelete);
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
                    await fetchTeams();
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
            item.teamName,
            item.jamiaat,
            item.id
        ]);
    }, [tableData]);

    return (
        <Fragment>
            {/* Custom styles */}
            <style>
                {`
                    /* Search bar styles */
                    #grid-team-table .gridjs-search {
                        width: 100%;
                        margin-bottom: 1rem;
                    }
                    #grid-team-table .gridjs-search-input {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        font-size: 14px;
                    }
                    #grid-team-table .gridjs-search-input:focus {
                        outline: none;
                        border-color: #0d6efd;
                        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                    }
                    #grid-team-table .gridjs-wrapper {
                        margin-top: 0.5rem;
                    }
                    #grid-team-table .gridjs-container {
                        padding: 0;
                    }

                    /* Sorting arrow styles */
                    #grid-team-table .gridjs-th-sort {
                        position: relative;
                        cursor: pointer;
                    }
                    #grid-team-table .gridjs-th-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                    }
                    #grid-team-table button.gridjs-sort {
                        background: none;
                        border: none;
                        width: 20px;
                        height: 20px;
                        position: relative;
                        cursor: pointer;
                        float: right;
                        margin-left: 8px;
                    }
                    #grid-team-table button.gridjs-sort::before,
                    #grid-team-table button.gridjs-sort::after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                    }
                    #grid-team-table button.gridjs-sort::before {
                        top: 2px;
                        border-bottom: 6px solid #bbb;
                    }
                    #grid-team-table button.gridjs-sort::after {
                        bottom: 2px;
                        border-top: 6px solid #bbb;
                    }
                    #grid-team-table button.gridjs-sort-asc::before {
                        border-bottom-color: #333;
                    }
                    #grid-team-table button.gridjs-sort-asc::after {
                        border-top-color: #bbb;
                    }
                    #grid-team-table button.gridjs-sort-desc::before {
                        border-bottom-color: #bbb;
                    }
                    #grid-team-table button.gridjs-sort-desc::after {
                        border-top-color: #333;
                    }
                    #grid-team-table .gridjs-sort-neutral,
                    #grid-team-table .gridjs-sort-asc,
                    #grid-team-table .gridjs-sort-desc {
                        background-image: none !important;
                    }

                    /* Pagination styles */
                    #grid-team-table .gridjs-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-top: 1px solid #e9ecef;
                        margin-top: 1rem;
                    }
                    #grid-team-table .gridjs-pagination {
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                    }
                    #grid-team-table .gridjs-summary {
                        order: 1;
                        color: #6c757d;
                        font-size: 14px;
                    }
                    #grid-team-table .gridjs-pages {
                        order: 2;
                        display: flex;
                        gap: 5px;
                    }
                    #grid-team-table .gridjs-pages button {
                        min-width: 35px;
                        height: 35px;
                        border: 1px solid #dee2e6;
                        background: #fff;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 14px;
                    }
                    #grid-team-table .gridjs-pages button:hover:not(:disabled) {
                        background: #e9ecef;
                        border-color: #adb5bd;
                    }
                    #grid-team-table .gridjs-pages button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    #grid-team-table .gridjs-pages button.gridjs-currentPage {
                        background: var(--primary-color, #0d6efd);
                        color: #fff;
                        border-color: var(--primary-color, #0d6efd);
                    }

                    /* Action buttons spacing */
                    #grid-team-table .btn-action-group {
                        display: inline-flex;
                        gap: 10px;
                        align-items: center;
                    }
                    #grid-team-table .btn-action-group .btn {
                        margin: 0 !important;
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
                title="Delete Team"
                message="Are you sure you want to delete this team? This will perform a soft delete - the team will be marked as deleted but data remains in the database."
                itemName={deleteData.name}
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="danger"
            />

            {/* AddJamaat Modal - For Creating New Teams */}
            <AddJamaat
                show={showAddForm}
                onClose={handleCloseAddModal}
                onSave={handleSave}
            />

            {/* EditJamaat Modal - For Editing Existing Teams */}
            <EditJamaat
                show={showEditForm}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdate}
                teamId={editTeamId}
            />

            {/* Main Table */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <div>
                                <Card.Title className="mb-1">
                                    Team Master
                                </Card.Title>
                                <span className="badge bg-primary-transparent">
                                    Total Records: {totalRecords}
                                </span>
                            </div>
                            <div>
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
                                    <p className="mt-3">Loading teams data...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <i className="ri-error-warning-line" style={{ fontSize: '48px' }}></i>
                                    <div className="error-message">
                                        <div className="error-title">⚠️ Error Loading Teams</div>
                                        <div className="error-details">{error}</div>
                                    </div>
                                    <button 
                                        className="btn btn-primary mt-3" 
                                        onClick={fetchTeams}
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
                                    <p className="mt-3">No teams found</p>
                                    <button 
                                        className="btn btn-primary mt-2" 
                                        onClick={handleAdd}
                                    >
                                        <i className="ri-add-line me-2"></i>
                                        Add First Team
                                    </button>
                                </div>
                            ) : (
                                <div id="grid-team-table">
                                    <Grid
                                        key={gridKey}
                                        data={gridData}
                                        sort={true}
                                        search={{
                                            enabled: true,
                                            placeholder: 'Search teams...'
                                        }}
                                        columns={[
                                            { 
                                                name: 'Sr.No.',
                                                width: '100px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Team Name',
                                                width: '200px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Jamiaat',
                                                width: '200px',
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

const useDeleteTeam = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const deleteTeam = async (teamId) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            // Get access token from session storage (same as AddJamaat)
            const token = sessionStorage.getItem('access_token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                setIsDeleting(false);
                return { success: false, message: 'Authentication token not found' };
            }

            // Validate team ID
            if (!teamId) {
                toast.error('Team ID is required');
                setIsDeleting(false);
                return { success: false, message: 'Team ID is required' };
            }

            // API endpoint
            const apiUrl = `${API_BASE_URL}/Team/DeleteTeam`;

            console.log('Deleting team:', teamId);
            console.log('API URL:', apiUrl);

            // Make DELETE request
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    team_id: teamId
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
                    toast.success('Team deleted successfully!');
                    setIsDeleting(false);
                    return {
                        success: true,
                        message: result.message || 'Team deleted successfully',
                        data: result.data
                    };
                } else if (result.data?.result_code === 0) {
                    // Failure - Team not found or already deleted
                    toast.error('Team not found or already deleted');
                    setDeleteError('Team not found or already deleted');
                    setIsDeleting(false);
                    return {
                        success: false,
                        message: 'Team not found or already deleted'
                    };
                } else {
                    // Unknown result code
                    toast.error(result.message || 'Failed to delete team');
                    setDeleteError(result.message || 'Failed to delete team');
                    setIsDeleting(false);
                    return {
                        success: false,
                        message: result.message || 'Failed to delete team'
                    };
                }
            } else {
                // Response not OK or not successful
                const errorMessage = result.message || result.detail || 'Failed to delete team';
                toast.error(errorMessage);
                setDeleteError(errorMessage);
                setIsDeleting(false);
                return {
                    success: false,
                    message: errorMessage
                };
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            const errorMessage = error.message || 'An error occurred while deleting the team. Please try again.';
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
        deleteTeam,
        isDeleting,
        deleteError,
        resetDeleteState
    };
};



// const TeamTable = () => {
//     // State management
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [editData, setEditData] = useState(null);
//     const [tableData, setTableData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch teams data from API
//     const fetchTeams = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Get access token from session storage
//             const accessToken = sessionStorage.getItem('access_token');
            
//             console.log('Access Token:', accessToken ? 'Token found' : 'Token not found');
            
//             if (!accessToken) {
//                 throw new Error('Access token not found. Please login again.');
//             }

//             // Construct the full API URL
//             const apiUrl = `${API_BASE_URL}/Team/GetAllTeams`;
//             console.log('Fetching from:', apiUrl);

//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`
//                 }
//             });

//             console.log('Response status:', response.status);
//             console.log('Response headers:', response.headers);

//             // Check if response is JSON
//             const contentType = response.headers.get('content-type');
//             if (!contentType || !contentType.includes('application/json')) {
//                 const textResponse = await response.text();
//                 console.error('Non-JSON response received:', textResponse.substring(0, 200));
//                 throw new Error(`Server returned non-JSON response. Status: ${response.status}. Check if the API endpoint is correct.`);
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log('API Response:', result);

//             if (result.success && result.data) {
//                 // Transform API data to match table structure
//                 const transformedData = result.data.map((item, index) => ({
//                     id: item.team_id,
//                     srNo: index + 1,
//                     teamName: item.team_name,
//                     jamiaat: item.jamiaat_name,
//                     jamiaatId: item.jamiaat_id
//                 }));
//                 console.log('Transformed data:', transformedData);
//                 setTableData(transformedData);
//             } else {
//                 throw new Error(result.message || 'Failed to fetch teams');
//             }
//         } catch (err) {
//             console.error('Error fetching teams:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch data on component mount
//     useEffect(() => {
//         fetchTeams();
//     }, []);

//     // Total records count
//     const totalRecords = tableData.length;

//     // Handle Add button click
//     const handleAdd = () => {
//         setEditData(null);
//         setShowAddForm(true);
//     };

//     // Handle Close modal
//     const handleCloseModal = () => {
//         setShowAddForm(false);
//         setEditData(null);
//     };

//     // Handle Save
//     const handleSave = (data) => {
//         console.log('Saved Data:', data);
//         // Refresh the table after saving
//         setShowAddForm(false);
//         fetchTeams();
//     };

//     // Handle Edit
//     const handleEdit = (id) => {
//         const itemToEdit = tableData.find(item => item.id === id);
//         if (itemToEdit) {
//             console.log('Editing team:', itemToEdit);
//             setEditData(itemToEdit);
//             setShowAddForm(true);
//         }
//     };

//     // Handle Delete
//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this team?')) {
//             try {
//                 const accessToken = sessionStorage.getItem('access_token');
                
//                 if (!accessToken) {
//                     alert('Access token not found. Please login again.');
//                     return;
//                 }

//                 // Construct delete API URL
//                 const apiUrl = `${API_BASE_URL}/Team/DeleteTeam/${id}`;
                
//                 const response = await fetch(apiUrl, {
//                     method: 'DELETE',
//                     headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${accessToken}`
//                     }
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || errorData.detail || `Failed to delete team. Status: ${response.status}`);
//                 }

//                 const result = await response.json();
                
//                 if (result.success) {
//                     alert('Team deleted successfully');
//                     await fetchTeams();
//                 } else {
//                     throw new Error(result.message || 'Failed to delete team');
//                 }
//             } catch (err) {
//                 console.error('Error deleting team:', err);
//                 alert(`Failed to delete team: ${err.message}`);
//             }
//         }
//     };

//     // Make functions globally accessible for Grid.js buttons
//     useEffect(() => {
//         window.handleEditClick = handleEdit;
//         window.handleDeleteClick = handleDelete;

//         // Cleanup
//         return () => {
//             delete window.handleEditClick;
//             delete window.handleDeleteClick;
//         };
//     }, [tableData]);

//     // Format data for Grid.js
//     const gridData = tableData.map(item => [
//         item.srNo,
//         item.teamName,
//         item.jamiaat,
//         item.id
//     ]);

//     return (
//         <Fragment>
//             {/* Custom styles */}
//             <style>
//                 {`
//                     /* Search bar styles */
//                     #grid-team-table .gridjs-search {
//                         width: 100%;
//                         margin-bottom: 1rem;
//                     }
//                     #grid-team-table .gridjs-search-input {
//                         width: 100%;
//                         padding: 8px 12px;
//                         border: 1px solid #dee2e6;
//                         border-radius: 6px;
//                         font-size: 14px;
//                     }
//                     #grid-team-table .gridjs-search-input:focus {
//                         outline: none;
//                         border-color: #0d6efd;
//                         box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
//                     }
//                     #grid-team-table .gridjs-wrapper {
//                         margin-top: 0.5rem;
//                     }
//                     #grid-team-table .gridjs-container {
//                         padding: 0;
//                     }

//                     /* Sorting arrow styles */
//                     #grid-team-table .gridjs-th-sort {
//                         position: relative;
//                         cursor: pointer;
//                     }
//                     #grid-team-table .gridjs-th-content {
//                         display: flex;
//                         align-items: center;
//                         justify-content: space-between;
//                         width: 100%;
//                     }
//                     #grid-team-table button.gridjs-sort {
//                         background: none;
//                         border: none;
//                         width: 20px;
//                         height: 20px;
//                         position: relative;
//                         cursor: pointer;
//                         float: right;
//                         margin-left: 8px;
//                     }
//                     #grid-team-table button.gridjs-sort::before,
//                     #grid-team-table button.gridjs-sort::after {
//                         content: '';
//                         position: absolute;
//                         left: 50%;
//                         transform: translateX(-50%);
//                         width: 0;
//                         height: 0;
//                         border-left: 5px solid transparent;
//                         border-right: 5px solid transparent;
//                     }
//                     #grid-team-table button.gridjs-sort::before {
//                         top: 2px;
//                         border-bottom: 6px solid #bbb;
//                     }
//                     #grid-team-table button.gridjs-sort::after {
//                         bottom: 2px;
//                         border-top: 6px solid #bbb;
//                     }
//                     #grid-team-table button.gridjs-sort-asc::before {
//                         border-bottom-color: #333;
//                     }
//                     #grid-team-table button.gridjs-sort-asc::after {
//                         border-top-color: #bbb;
//                     }
//                     #grid-team-table button.gridjs-sort-desc::before {
//                         border-bottom-color: #bbb;
//                     }
//                     #grid-team-table button.gridjs-sort-desc::after {
//                         border-top-color: #333;
//                     }
//                     #grid-team-table .gridjs-sort-neutral,
//                     #grid-team-table .gridjs-sort-asc,
//                     #grid-team-table .gridjs-sort-desc {
//                         background-image: none !important;
//                     }

//                     /* Pagination styles */
//                     #grid-team-table .gridjs-footer {
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                         padding: 12px 0;
//                         border-top: 1px solid #e9ecef;
//                         margin-top: 1rem;
//                     }
//                     #grid-team-table .gridjs-pagination {
//                         display: flex;
//                         width: 100%;
//                         justify-content: space-between;
//                         align-items: center;
//                     }
//                     #grid-team-table .gridjs-summary {
//                         order: 1;
//                         color: #6c757d;
//                         font-size: 14px;
//                     }
//                     #grid-team-table .gridjs-pages {
//                         order: 2;
//                         display: flex;
//                         gap: 5px;
//                     }
//                     #grid-team-table .gridjs-pages button {
//                         min-width: 35px;
//                         height: 35px;
//                         border: 1px solid #dee2e6;
//                         background: #fff;
//                         border-radius: 6px;
//                         cursor: pointer;
//                         transition: all 0.2s ease;
//                         font-size: 14px;
//                     }
//                     #grid-team-table .gridjs-pages button:hover:not(:disabled) {
//                         background: #e9ecef;
//                         border-color: #adb5bd;
//                     }
//                     #grid-team-table .gridjs-pages button:disabled {
//                         opacity: 0.5;
//                         cursor: not-allowed;
//                     }
//                     #grid-team-table .gridjs-pages button.gridjs-currentPage {
//                         background: var(--primary-color, #0d6efd);
//                         color: #fff;
//                         border-color: var(--primary-color, #0d6efd);
//                     }

//                     /* Action buttons spacing */
//                     #grid-team-table .btn-action-group {
//                         display: inline-flex;
//                         gap: 10px;
//                         align-items: center;
//                     }
//                     #grid-team-table .btn-action-group .btn {
//                         margin: 0 !important;
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

//                     /* Modal Overlay Styles */
//                     .modal-overlay {
//                         position: fixed;
//                         top: 0;
//                         left: 0;
//                         right: 0;
//                         bottom: 0;
//                         background: rgba(0, 0, 0, 0.5);
//                         backdrop-filter: blur(4px);
//                         -webkit-backdrop-filter: blur(4px);
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         z-index: 1050;
//                         animation: fadeIn 0.2s ease;
//                     }

//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }

//                     @keyframes slideIn {
//                         from {
//                             opacity: 0;
//                             transform: translateY(-20px);
//                         }
//                         to {
//                             opacity: 1;
//                             transform: translateY(0);
//                         }
//                     }

//                     .modal-form-container {
//                         background: #fff;
//                         border-radius: 12px;
//                         padding: 25px;
//                         width: 90%;
//                         max-width: 700px;
//                         max-height: 90vh;
//                         overflow-y: auto;
//                         box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
//                         animation: slideIn 0.3s ease;
//                     }

//                     .modal-form-container .form-title {
//                         font-size: 20px;
//                         font-weight: 600;
//                         margin-bottom: 20px;
//                         color: #333;
//                         border-bottom: 2px solid #0d6efd;
//                         padding-bottom: 12px;
//                         display: flex;
//                         align-items: center;
//                         justify-content: space-between;
//                     }

//                     .modal-form-container .form-title .close-btn {
//                         background: none;
//                         border: none;
//                         font-size: 24px;
//                         color: #666;
//                         cursor: pointer;
//                         padding: 0;
//                         line-height: 1;
//                         transition: color 0.2s;
//                     }

//                     .modal-form-container .form-title .close-btn:hover {
//                         color: #dc3545;
//                     }

//                     .modal-form-container .form-buttons {
//                         display: flex;
//                         gap: 10px;
//                         margin-top: 25px;
//                         justify-content: center;
//                         padding-top: 15px;
//                         border-top: 1px solid #e9ecef;
//                     }

//                     /* Horizontal Form Styles */
//                     .horizontal-form-group {
//                         display: flex;
//                         align-items: center;
//                     }
//                     .horizontal-form-group .form-label {
//                         min-width: 70px;
//                         margin-bottom: 0;
//                         margin-right: 10px;
//                         font-weight: 500;
//                         text-align: right;
//                         white-space: nowrap;
//                     }
//                     .horizontal-form-group .form-input-wrapper {
//                         flex: 1;
//                     }

//                     .form-row-inline {
//                         display: flex;
//                         gap: 20px;
//                         margin-bottom: 15px;
//                     }
//                     .form-row-inline .horizontal-form-group {
//                         flex: 1;
//                     }

//                     .form-row-full {
//                         margin-bottom: 15px;
//                     }

//                     /* Clear button style */
//                     .btn-clear {
//                         background-color: #6c757d !important;
//                         border-color: #6c757d !important;
//                         color: #fff !important;
//                     }
//                     .btn-clear:hover {
//                         background-color: #5c636a !important;
//                         border-color: #565e64 !important;
//                     }
//                     .btn-clear:focus {
//                         box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.5) !important;
//                     }
//                 `}
//             </style>

//             {/* AddJamaat Modal - Independent Component */}
//             <AddJamaat
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
//                                     Team Master
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
//                             {loading ? (
//                                 <div className="loading-container">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                     <p className="mt-3">Loading teams data...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="error-container">
//                                     <i className="ri-error-warning-line" style={{ fontSize: '48px' }}></i>
//                                     <div className="error-message">
//                                         <div className="error-title">⚠️ Error Loading Teams</div>
//                                         <div className="error-details">{error}</div>
//                                     </div>
//                                     <button 
//                                         className="btn btn-primary mt-3" 
//                                         onClick={fetchTeams}
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
//                                     <p className="mt-3">No teams found</p>
//                                     <button 
//                                         className="btn btn-primary mt-2" 
//                                         onClick={handleAdd}
//                                     >
//                                         <i className="ri-add-line me-2"></i>
//                                         Add First Team
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div id="grid-team-table">
//                                     <Grid
//                                         data={gridData}
//                                         sort={true}
//                                         search={{
//                                             enabled: true,
//                                             placeholder: 'Search teams...'
//                                         }}
//                                         columns={[
//                                             { 
//                                                 name: 'Sr.No.',
//                                                 width: '100px',
//                                                 sort: true
//                                             }, 
//                                             { 
//                                                 name: 'Team Name',
//                                                 width: '200px',
//                                                 sort: true
//                                             }, 
//                                             { 
//                                                 name: 'Jamiaat',
//                                                 width: '200px',
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

export default TeamTable;