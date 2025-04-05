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
            
            // Initialize Firestore
            const db = firebase.firestore();
            
            // Get form elements
            const registerForm = document.getElementById('registerForm');
            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const confirmError = document.getElementById('confirmError');
            const registerError = document.getElementById('registerError');
            const registerStatus = document.getElementById('registerStatus');
            const googleSignUpButton = document.getElementById('googleSignUp');
            
            // Email and password registration
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Clear previous errors
                nameError.textContent = '';
                emailError.textContent = '';
                passwordError.textContent = '';
                confirmError.textContent = '';
                registerError.textContent = '';
                
                // Get values
                const fullName = fullNameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                
                // Validate
                let isValid = true;
                
                if (fullName.length < 3) {
                    nameError.textContent = 'Name must be at least 3 characters';
                    isValid = false;
                }
                
                if (!validateEmail(email)) {
                    emailError.textContent = 'Please enter a valid email address';
                    isValid = false;
                }
                
                if (password.length < 6) {
                    passwordError.textContent = 'Password must be at least 6 characters';
                    isValid = false;
                }
                
                if (password !== confirmPassword) {
                    confirmError.textContent = 'Passwords do not match';
                    isValid = false;
                }
                
                if (isValid) {
                    // Create user with Firebase
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // User created successfully
                            const user = userCredential.user;
                            
                            // Update profile with name
                            return user.updateProfile({
                                displayName: fullName
                            }).then(() => {
                                // Save additional user data to Firestore
                                return db.collection('users').doc(user.uid).set({
                                    fullName: fullName,
                                    email: email,
                                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                                });
                            });
                        })
                        .then(() => {
                            // Registration complete
                            registerStatus.textContent = 'Registration successful! Redirecting to login...';
                            setTimeout(() => {
                                window.location.href = 'login.html';
                            }, 2000);
                        })
                        .catch((error) => {
                            // Handle errors
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            
                            if (errorCode === 'auth/email-already-in-use') {
                                emailError.textContent = 'This email is already registered';
                            } else {
                                registerError.textContent = errorMessage;
                            }
                        });
                }
            });
            
            // Google Sign Up
            googleSignUpButton.addEventListener('click', function() {
                const provider = new firebase.auth.GoogleAuthProvider();
                
                firebase.auth().signInWithPopup(provider)
                    .then((result) => {
                        const user = result.user;
                        
                        // Check if this is a new user
                        const isNewUser = result.additionalUserInfo.isNewUser;
                        
                        if (isNewUser) {
                            // Save user data to Firestore for new users
                            return db.collection('users').doc(user.uid).set({
                                fullName: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            }).then(() => {
                                registerStatus.textContent = 'Registration with Google successful! Redirecting...';
                                setTimeout(() => {
                                    window.location.href = 'dashboard.html';
                                }, 1000);
                            });
                        } else {
                            // Existing user, redirect to dashboard
                            registerStatus.textContent = 'You already have an account! Redirecting...';
                            setTimeout(() => {
                                window.location.href = 'dashboard.html';
                            }, 1000);
                        }
                    })
                    .catch((error) => {
                        // Handle error
                        registerError.textContent = error.message;
                    });
            });
            
            // Check if user is already logged in
            // firebase.auth().onAuthStateChanged((user) => {
            //     if (user) {
            //         // User is signed in, check if they have a profile
            //         db.collection('users').doc(user.uid).get()
            //             .then((doc) => {
            //                 if (doc.exists) {
            //                     // User has completed registration, redirect to dashboard
            //                     registerStatus.textContent = 'You are already registered. Redirecting...';
            //                     setTimeout(() => {
            //                         window.location.href = 'dashboard.html';
            //                     }, 1000);
            //                 }
            //             });
            //     }
            // });
            
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }