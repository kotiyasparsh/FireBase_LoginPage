// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNtI8fsTmh4K9MXXuTNVli8lHtEFvAVoM",
    authDomain: "digibridge-2761e.firebaseapp.com",
    projectId: "digibridge-2761e",
    storageBucket: "digibridge-2761e.firebasestorage.app",
    messagingSenderId: "870963362960",
    appId: "1:870963362960:web:f76e6ef057a2a4985dac15",
    measurementId: "G-DLDNDE6XD5"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginError = document.getElementById('loginError');
    const loginStatus = document.getElementById('loginStatus');
    const googleSignInButton = document.getElementById('googleSignIn');
    
    // Email and password login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        emailError.textContent = '';
        passwordError.textContent = '';
        loginError.textContent = '';
        
        // Get values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate
        let isValid = true;
        
        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        if (isValid) {
            // Sign in with Firebase
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Success - redirect to dashboard or home page
                    loginStatus.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                })
                .catch((error) => {
                    // Handle errors
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    
                    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                        loginError.textContent = 'Invalid email or password';
                    } else {
                        loginError.textContent = errorMessage;
                    }
                });
        }
    });
    
    // Google Sign In
    googleSignInButton.addEventListener('click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                // Success - redirect to dashboard
                loginStatus.textContent = 'Google login successful! Redirecting...';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            })
            .catch((error) => {
                // Handle error
                loginError.textContent = error.message;
            });
    });
    
    // Check if user is already logged in
    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //         // User is signed in, redirect to dashboard
    //         loginStatus.textContent = 'You are already logged in. Redirecting...';
    //         setTimeout(() => {
    //             window.location.href = 'dashboard.html';
    //         }, 1000);
    //     }
    // });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }