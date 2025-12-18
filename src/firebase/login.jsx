// import { Fragment, useEffect, useState } from 'react';
// import { Alert, Button, Card, Col, Form, InputGroup, Nav, Tab } from 'react-bootstrap';
// import desktoplogo from "../assets/images/brand-logos/desktop-logo.png";
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from './firebaseapi';
// import { connect } from "react-redux";
// // import { LocalStorageBackup } from '../components/common/switcher/switcherdata/switcherdata';
// import { LocalStorageBackup } from '../components/common/switcher/switcherdata';

// import { ThemeChanger } from "../redux/action";


// const Login = ({ ThemeChanger }) => {
//     const [passwordshow1, setpasswordshow1] = useState(false);
//     const [err, setError] = useState("");
//     const [data, setData] = useState({
//         "email": "adminreact@gmail.com",
//         "password": "1234567890",
//     });
//     const { email, password } = data;
//     const changeHandler = (e) => {
//         setData({ ...data, [e.target.name]: e.target.value });
//         setError("");
//     };
//     const navigate = useNavigate();
//     const routeChange = () => {
//         const path = `${import.meta.env.BASE_URL}dashboard`;
//         navigate(path);
//     };

//     const Login = (e) => {
//         e.preventDefault();
//         auth.signInWithEmailAndPassword(email, password).then(
//             user => { console.log(user); routeChange(); }).catch(err => { console.log(err); setError(err.message); });
//     };
//     const Login1 = () => {
//         if (data.email == "adminreact@gmail.com" && data.password == "1234567890") {
//             routeChange();
//         }
//         else {
//             setError("The Auction details did not Match");
//             setData({
//                 "email": "adminreact@gmail.com",
//                 "password": "1234567890",
//             });
//         }
//     };

//     useEffect(() => {
//         LocalStorageBackup(ThemeChanger);
//     }, []);

//     return (
//         <Fragment>
//             <div className="container">
//                 <div className="row justify-content-center align-items-center authentication authentication-basic vh-100 pt-3">
//                     <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
//                         <div className="my-5 d-flex justify-content-center">
//                             <Link to={`${import.meta.env.BASE_URL}dashboard`}>
//                                 <img src={desktoplogo} alt="logo" className="desktop-logo" />
//                                 {/* <img src={desktopdarklogo} alt="logo" className="desktop-dark" /> */}
//                             </Link>
//                         </div>
//                         <Tab.Container id="left-tabs-example" defaultActiveKey="react">
//                             <Card>
                                
//                                 <Tab.Content>
//                                     <Tab.Pane eventKey="react" className='border-0 pb-2'>
//                                         <div className="p-4">
//                                             <p className="h5 fw-semibold mb-2 text-center">Sign In</p>
//                                             <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back</p>
//                                             <div className="row gy-3">
//                                                 {err && <Alert variant="danger">{err}</Alert>}
//                                                 <Col xl={12}>
//                                                     <Form.Label htmlFor="signin-username" className="form-label text-default">Email</Form.Label>
//                                                     <Form.Control size="lg"
//                                                         className=""
//                                                         placeholder="Enter your email"
//                                                         name="email"
//                                                         type='text'
//                                                         value={email}
//                                                         onChange={changeHandler}
//                                                         required
//                                                     />
//                                                 </Col>
//                                                 <Col xl={12} className="mb-2">
//                                                     <Form.Label htmlFor="signin-password" className="form-label text-default d-block">Password</Form.Label>
//                                                         {/* <Link to={`${import.meta.env.BASE_URL}custompages/forgotpassword`} className="float-end text-danger">Forget password ?</Link></Form.Label> */}
//                                                     <InputGroup>
//                                                         <Form.Control size="lg" className="form-control" placeholder="Enter your password" name="password" type={(passwordshow1) ? 'text' : "password"} value={password} onChange={changeHandler} required />
//                                                         <Button variant='light' className="btn btn-light " type="button" onClick={() => setpasswordshow1(!passwordshow1)}
//                                                             id="button-addon2"><i className={` text-dark ${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} aria-hidden="true"></i></Button>
//                                                     </InputGroup>
//                                                 </Col>
//                                                 <Col xl={12} className="d-grid mt-2">
//                                                     <Button variant='primary' onClick={Login1} size='lg' className="btn">Sign In</Button>
//                                                 </Col>
//                                             </div>
//                                         </div>
//                                     </Tab.Pane>
//                                     <Tab.Pane eventKey="firebase" className='border-0 pb-2'>
//                                         <div className="p-4">
//                                             <p className="h5 fw-semibold mb-2 text-center">Sign In</p>
//                                             <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back Jhon !</p>
//                                             <div className="row gy-3">
//                                                 {err && <Alert variant="danger">{err}</Alert>}
//                                                 <Col xl={12}>
//                                                     <Form.Label htmlFor="signin-username" className="form-label text-default">Email</Form.Label>
//                                                     <Form.Control size="lg"
//                                                         className=""
//                                                         placeholder="Enter your email"
//                                                         name="email"
//                                                         type='text'
//                                                         value={email}
//                                                         onChange={changeHandler}
//                                                         required
//                                                     />
//                                                 </Col>
//                                                 <Col xl={12} className="mb-2">
//                                                     <Form.Label htmlFor="signin-password" className="form-label text-default d-block">Password
//                                                         <Link to="#" className="float-end text-danger">Forget password ?</Link></Form.Label>
//                                                     <InputGroup>
//                                                         <Form.Control size="lg" className="form-control" placeholder="Enter your password" name="password" type={(passwordshow1) ? 'text' : "password"} value={password} onChange={changeHandler} required />
//                                                         <Button variant='light' className="btn btn-light" type="button" onClick={() => setpasswordshow1(!passwordshow1)}
//                                                             id="button-addon2"><i className={`text-dark ${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} aria-hidden="true"></i></Button>
//                                                     </InputGroup>
//                                                     <div className="mt-2">
//                                                         <div className="form-check">
//                                                             <Form.Check className="" type="checkbox" value="" id="defaultCheck1" />
//                                                             <Form.Label className=" text-muted fw-normal" htmlFor="defaultCheck1">
//                                                                 Remember password ?
//                                                             </Form.Label>
//                                                         </div>
//                                                     </div>
//                                                 </Col>
//                                                 <Col xl={12} className="d-grid mt-2">
//                                                     <Button variant='primary' onClick={Login1} size='lg' className="btn">Sign In</Button>
//                                                 </Col>
//                                             </div>
//                                             <div className="text-center">
//                                                 <p className="fs-12 text-muted mt-3">Dont have an account? <Link to={`${import.meta.env.BASE_URL}firebase/signup`} className="text-primary">Sign Up</Link></p>
//                                             </div>
//                                             <div className="text-center my-3 authentication-barrier">
//                                                 <span>OR</span>
//                                             </div>
//                                             <div className="btn-list text-center">
//                                                 <Button variant='light' className="btn btn-icon">
//                                                     <i className="ri-facebook-line fw-bold text-dark op-7"></i>
//                                                 </Button>
//                                                 <Button variant='light' className="btn btn-icon">
//                                                     <i className="ri-google-line fw-bold text-dark op-7"></i>
//                                                 </Button>
//                                                 <Button variant='light' className="btn btn-icon">
//                                                     <i className="ri-twitter-x-line fw-bold text-dark op-7"></i>
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </Tab.Pane>
//                                 </Tab.Content>
//                             </Card>
//                         </Tab.Container>
//                     </Col>
//                 </div>
//             </div>
//         </Fragment>
//     );
// };

// const mapStateToProps = (state) => ({
//     local_varaiable: state
// });

// export default connect(mapStateToProps, { ThemeChanger })(Login);


import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import desktoplogo from "../assets/images/brand-logos/desktop-logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { LocalStorageBackup } from '../components/common/switcher/switcherdata';
import { ThemeChanger } from "../redux/action";

const Login = ({ ThemeChanger }) => {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [err, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        "username": "",
        "password": "",
    });
    
    const { username, password } = data;
    
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError("");
    };
    
    const navigate = useNavigate();
    
    const routeChange = () => {
        const path = `${import.meta.env.BASE_URL}dashboard`;
        navigate(path);
    };

    // Function to store user data in sessionStorage
    const storeUserSession = (userData, tokens) => {
        // Store only required user fields
        sessionStorage.setItem('its_id', userData.its_id?.toString() || '');
        sessionStorage.setItem('full_name', userData.full_name || '');
        sessionStorage.setItem('team_id', userData.team_id?.toString() || '');
        sessionStorage.setItem('position_id', userData.position_id?.toString() || '');
        sessionStorage.setItem('jamaat_id', userData.jamaat_id?.toString() || '');
        sessionStorage.setItem('jamaat_name', userData.jamaat_name || '');
        sessionStorage.setItem('role_id', userData.role_id?.toString() || '');
        sessionStorage.setItem('is_admin', userData.is_admin?.toString() || 'false');
        sessionStorage.setItem('access_rights', userData.access_rights || '');
        
        // Store access token
        sessionStorage.setItem('access_token', tokens.access_token || '');
        
        // Calculate and store expiry time (current time + expires_in seconds)
        const expiryTime = Date.now() + (tokens.expires_in * 1000);
        sessionStorage.setItem('session_expiry', expiryTime.toString());
        
        sessionStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }
        
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch(
                'http://13.204.161.209:8080/BURHANI_GUARDS_API_TEST/api/Login/CheckLogin',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            );
            
            const result = await response.json();
            
            console.log('Login Response:', result);
            
            // Check if login was successful
            if (response.ok && result.success) {
                // Store user data and tokens in sessionStorage
                storeUserSession(result.data, result.tokens);
                
                // Navigate to dashboard on successful login
                routeChange();
            } else {
                // Handle error response
                setError(result.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        LocalStorageBackup(ThemeChanger);
        
        // If already logged in and session valid, redirect to dashboard
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const sessionExpiry = sessionStorage.getItem('session_expiry');
        
        if (isLoggedIn && sessionExpiry) {
            const currentTime = Date.now();
            const expiryTime = parseInt(sessionExpiry, 10);
            
            if (currentTime < expiryTime) {
                routeChange();
            }
        }
    }, []);

    return (
        <Fragment>
            <div className="container">
                <div className="row justify-content-center align-items-center authentication authentication-basic vh-100 pt-3">
                    <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
                        <div className="my-5 d-flex justify-content-center">
                            <Link to={`${import.meta.env.BASE_URL}dashboard`}>
                                <img src={desktoplogo} alt="logo" className="desktop-logo" />
                            </Link>
                        </div>
                        <Card>
                            <div className="p-4">
                                <p className="h5 fw-semibold mb-2 text-center">Sign In</p>
                                <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back</p>
                                <Form onSubmit={handleLogin}>
                                    <div className="row gy-3">
                                        {err && <Alert variant="danger">{err}</Alert>}
                                        <Col xl={12}>
                                            <Form.Label htmlFor="signin-username" className="form-label text-default">
                                                Username
                                            </Form.Label>
                                            <Form.Control 
                                                size="lg"
                                                placeholder="Enter your username"
                                                name="username"
                                                type="text"
                                                value={username}
                                                onChange={changeHandler}
                                                required
                                                disabled={loading}
                                            />
                                        </Col>
                                        <Col xl={12} className="mb-2">
                                            <Form.Label htmlFor="signin-password" className="form-label text-default d-block">
                                                Password
                                            </Form.Label>
                                            <InputGroup>
                                                <Form.Control 
                                                    size="lg" 
                                                    className="form-control" 
                                                    placeholder="Enter your password" 
                                                    name="password" 
                                                    type={passwordshow1 ? 'text' : 'password'} 
                                                    value={password} 
                                                    onChange={changeHandler} 
                                                    required 
                                                    disabled={loading}
                                                />
                                                <Button 
                                                    variant='light' 
                                                    className="btn btn-light" 
                                                    type="button" 
                                                    onClick={() => setpasswordshow1(!passwordshow1)}
                                                    id="button-addon2"
                                                    disabled={loading}
                                                >
                                                    <i className={`text-dark ${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} aria-hidden="true"></i>
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                        <Col xl={12} className="d-grid mt-2">
                                            <Button 
                                                variant='primary' 
                                                type="submit"
                                                size='lg' 
                                                className="btn"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="me-2"
                                                        />
                                                        Signing In...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </Button>
                                        </Col>
                                    </div>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Login);