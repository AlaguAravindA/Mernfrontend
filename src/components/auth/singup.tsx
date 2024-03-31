import React, { useState } from 'react';
import zxcvbn from "zxcvbn";
import img from '../images/c.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import ErrorModal from './errorModal.tsx';
import { auth } from '../../firebaseauth';
import { Link, useNavigate } from 'react-router-dom';
import { animated } from 'react-spring';
import Loader from '../Loader.tsx';

export default function Reg() {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const closeModal = () => {
    setShowError(false);
  };


  const signUp = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      console.log(userCredential);
      history('/login');
    } catch (error) {
      setErrorMessage(error.code);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPass(password);
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const getStrengthDescription = (score) => {
    switch (score) {
      case 0:
        return 'The Force is not enough . Try something stronger!';
      case 1:
        return 'Still not good . Add more characters!';
      case 2:
        return 'Your password is like a cheesy rom-com. It’s okay, but it could be better!';
      case 3:
        return 'Your password is as strong as an action hero. Good job!';
      case 4:
        return 'Your password is like a blockbuster hit. It’s bulletproof!';
      default:
        return '';
    }
  };

  const getTextClass = (score) => {
    switch (score) {
      case 0:
        return 'text-red-500';
      case 1:
        return 'text-orange-500';
      case 2:
        return 'text-yellow-600';
      case 3:
        return 'text-green-500';
      case 4:
        return 'text-green-900';
      default:
        return '';
    }
  };

  return (
    <>
      <animated.div className="bg-transparent min-h-screen flex items-center justify-center px-4 py-16">
        {isLoading && <Loader></Loader>}
        {showError && (
        <ErrorModal errorMeassge={errorMessage} onclose={closeModal} />
      )}
      
        <div className="w-full max-w-md p-8 bg-slate-200 bg-opacity-70 rounded-lg shadow-lg">
          <div className="text-center">
            <img className="mx-auto mb-0 h-40 w-auto m rounded-full" src={img} alt="Your Company" />
            <h2 className="magnet mt-10 text-2xl font-bold leading-9 text-gray-900">Register Your Account</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={signUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={pass}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className="block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2"
                />
                {isPasswordFocused && pass.length > 0 && (
                  <div className=" top-full right-0 mt-1 flex items-center pr-3">
                    <span className={`text-sm font-semibold ${getTextClass(passwordStrength)}`}>
                      {getStrengthDescription(passwordStrength)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
              >
                Register
              </button>
              <p className="mt-6 text-center text-sm text-gray-900">
                Already have an Account?{' '}
                <Link to={'/login'} className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </animated.div>
    </>
  );
}
