import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import "gridjs/dist/theme/mermaid.css";
import { Grid } from 'gridjs-react';
import { html } from 'gridjs';

const DutiesTable = () => {
    // State management
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editDutyId, setEditDutyId] = useState(null);
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
    const { deleteDuty, isDeleting, deleteError, resetDeleteState } = useDeleteDuty();

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

    // Fetch duties data from API
    const fetchDuties = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = sessionStorage.getItem('access_token');
            
            if (!accessToken) {
                throw new Error('Access token not found. Please login again.');
            }

            const apiUrl = `${API_BASE_URL}/Duty/GetAllDuties`;

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
                    id: item.duty_id,
                    srNo: index + 1,
                    teamName: item.team_name,
                    miqaatName: item.miqaat_name,
                    quota: item.quota,
                    location: item.location,
                    teamId: item.team_id,
                    miqaatId: item.miqaat_id
                }));
                setTableData(transformedData);
            } else {
                throw new Error(result.message || 'Failed to fetch duties');
            }
        } catch (err) {
            console.error('Error fetching duties:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDuties();
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
        setEditDutyId(null);
    };

    // Handle Save (for Add)
    const handleSave = (data) => {
        console.log('Saved Data:', data);
        setShowAddForm(false);
        
        // Refresh the table
        fetchDuties();
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
    };

    // Handle Update (for Edit)
    const handleUpdate = (data) => {
        console.log('Updated Data:', data);
        setShowEditForm(false);
        setEditDutyId(null);
        
        // Optimistic update - update the specific row in the table
        setTableData(prevData => {
            return prevData.map(item => {
                if (item.id === data.duty_id) {
                    return {
                        ...item,
                        teamName: data.teamName,
                        miqaatName: data.miqaatName,
                        quota: data.quota,
                        location: data.location,
                        teamId: data.teamId,
                        miqaatId: data.miqaatId
                    };
                }
                return item;
            });
        });
        
        // Force grid refresh
        setGridKey(prev => prev + 1);
        
        // Background sync with server
        setTimeout(() => {
            fetchDuties();
        }, 500);
    };

    // Handle Edit
    const handleEdit = (id) => {
        console.log('Editing duty ID:', id);
        setEditDutyId(id);
        setShowEditForm(true);
    };

    // Handle Delete - Show confirmation modal
    const handleDelete = (id) => {
        const dutyToDelete = tableData.find(item => item.id === id);
        const dutyName = dutyToDelete ? `${dutyToDelete.teamName} - ${dutyToDelete.miqaatName}` : 'this duty';
        
        setDeleteData({ id, name: dutyName });
        handleModalOpen('deleteModal');
    };

    // ✅ Confirm Delete - WITH ALL FIXES
    const confirmDelete = async () => {
        const dutyIdToDelete = deleteData.id;
        
        console.log('Deleting duty ID:', dutyIdToDelete);
        
        const result = await deleteDuty(dutyIdToDelete);
        
        if (result.success) {
            console.log('Delete successful, updating UI...');
            
            // ✅ METHOD 1: Optimistic update - instant UI change
            setTableData(prevData => {
                const filtered = prevData.filter(item => item.id !== dutyIdToDelete);
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
                    await fetchDuties();
                    console.log('Table synced with server');
                } catch (error) {
                    console.error('Background sync failed:', error);
                }
            }, 500);
        }
    };

    // Make functions globally accessible for Grid.js buttons
    useEffect(() => {
        window.handleEditDutyClick = handleEdit;
        window.handleDeleteDutyClick = handleDelete;

        return () => {
            delete window.handleEditDutyClick;
            delete window.handleDeleteDutyClick;
        };
    }, [tableData]);

    // ✅ Format data for Grid.js with useMemo
    const gridData = useMemo(() => {
        console.log('Recalculating gridData, table length:', tableData.length);
        return tableData.map(item => [
            item.srNo,
            item.teamName,
            item.miqaatName,
            item.quota,
            item.location,
            item.id
        ]);
    }, [tableData]);

    return (
        <Fragment>
            {/* Custom styles */}
            <style>
                {`
                    /* Search bar styles */
                    #grid-duties-table .gridjs-search {
                        width: 100%;
                        margin-bottom: 1rem;
                    }
                    #grid-duties-table .gridjs-search-input {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        font-size: 14px;
                    }
                    #grid-duties-table .gridjs-search-input:focus {
                        outline: none;
                        border-color: #0d6efd;
                        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                    }
                    #grid-duties-table .gridjs-wrapper {
                        margin-top: 0.5rem;
                    }
                    #grid-duties-table .gridjs-container {
                        padding: 0;
                    }

                    /* Sorting arrow styles */
                    #grid-duties-table .gridjs-th-sort {
                        position: relative;
                        cursor: pointer;
                    }
                    #grid-duties-table .gridjs-th-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                    }
                    #grid-duties-table button.gridjs-sort {
                        background: none;
                        border: none;
                        width: 20px;
                        height: 20px;
                        position: relative;
                        cursor: pointer;
                        float: right;
                        margin-left: 8px;
                    }
                    #grid-duties-table button.gridjs-sort::before,
                    #grid-duties-table button.gridjs-sort::after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                    }
                    #grid-duties-table button.gridjs-sort::before {
                        top: 2px;
                        border-bottom: 6px solid #bbb;
                    }
                    #grid-duties-table button.gridjs-sort::after {
                        bottom: 2px;
                        border-top: 6px solid #bbb;
                    }
                    #grid-duties-table button.gridjs-sort-asc::before {
                        border-bottom-color: #333;
                    }
                    #grid-duties-table button.gridjs-sort-asc::after {
                        border-top-color: #bbb;
                    }
                    #grid-duties-table button.gridjs-sort-desc::before {
                        border-bottom-color: #bbb;
                    }
                    #grid-duties-table button.gridjs-sort-desc::after {
                        border-top-color: #333;
                    }
                    #grid-duties-table .gridjs-sort-neutral,
                    #grid-duties-table .gridjs-sort-asc,
                    #grid-duties-table .gridjs-sort-desc {
                        background-image: none !important;
                    }

                    /* Pagination styles */
                    #grid-duties-table .gridjs-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-top: 1px solid #e9ecef;
                        margin-top: 1rem;
                    }
                    #grid-duties-table .gridjs-pagination {
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                    }
                    #grid-duties-table .gridjs-summary {
                        order: 1;
                        color: #6c757d;
                        font-size: 14px;
                    }
                    #grid-duties-table .gridjs-pages {
                        order: 2;
                        display: flex;
                        gap: 5px;
                    }
                    #grid-duties-table .gridjs-pages button {
                        min-width: 35px;
                        height: 35px;
                        border: 1px solid #dee2e6;
                        background: #fff;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 14px;
                    }
                    #grid-duties-table .gridjs-pages button:hover:not(:disabled) {
                        background: #e9ecef;
                        border-color: #adb5bd;
                    }
                    #grid-duties-table .gridjs-pages button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    #grid-duties-table .gridjs-pages button.gridjs-currentPage {
                        background: var(--primary-color, #0d6efd);
                        color: #fff;
                        border-color: var(--primary-color, #0d6efd);
                    }

                    /* Action buttons spacing */
                    #grid-duties-table .btn-action-group {
                        display: inline-flex;
                        gap: 10px;
                        align-items: center;
                    }
                    #grid-duties-table .btn-action-group .btn {
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
                title="Delete Duty"
                message="Are you sure you want to delete this duty? This will perform a soft delete - the duty will be marked as deleted but data remains in the database."
                itemName={deleteData.name}
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                variant="danger"
            />

            {/* AddDuty Modal - For Creating New Duties */}
            <AddDuty
                show={showAddForm}
                onClose={handleCloseAddModal}
                onSave={handleSave}
            />

            {/* EditDuty Modal - For Editing Existing Duties */}
            <EditDuty
                show={showEditForm}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdate}
                dutyId={editDutyId}
            />

            {/* Main Table */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <div>
                                <Card.Title className="mb-1">
                                    Duties Master
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
                                    <p className="mt-3">Loading duties data...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <i className="ri-error-warning-line" style={{ fontSize: '48px' }}></i>
                                    <div className="error-message">
                                        <div className="error-title">⚠️ Error Loading Duties</div>
                                        <div className="error-details">{error}</div>
                                    </div>
                                    <button 
                                        className="btn btn-primary mt-3" 
                                        onClick={fetchDuties}
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
                                    <p className="mt-3">No duties found</p>
                                    <button 
                                        className="btn btn-primary mt-2" 
                                        onClick={handleAdd}
                                    >
                                        <i className="ri-add-line me-2"></i>
                                        Add First Duty
                                    </button>
                                </div>
                            ) : (
                                <div id="grid-duties-table">
                                    <Grid
                                        key={gridKey}
                                        data={gridData}
                                        sort={true}
                                        search={{
                                            enabled: true,
                                            placeholder: 'Search duties...'
                                        }}
                                        columns={[
                                            { 
                                                name: 'Sr.No.',
                                                width: '80px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Team Name',
                                                width: '180px',
                                                sort: true
                                            }, 
                                            { 
                                                name: 'Miqaat Name',
                                                width: '180px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Quota',
                                                width: '100px',
                                                sort: true
                                            },
                                            { 
                                                name: 'Location',
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
                                                            onclick="handleEditDutyClick(${cell})"
                                                        >
                                                            <i class="ri-edit-line"></i>
                                                        </button>
                                                        <button 
                                                            class="btn btn-sm btn-danger-transparent btn-icon btn-wave" 
                                                            title="Delete"
                                                            onclick="handleDeleteDutyClick(${cell})"
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

export default DutiesTable;