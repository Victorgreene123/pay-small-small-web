

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/hooks/useAlert';
import CustomAlert from '@/components/CustomAlert';

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();
    const { alert, showAlert, hideAlert } = useAlert();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login({ email, password });
            showAlert('success', 'Login successful! Redirecting...');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err: any) {
            showAlert('error', err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#EEF4FF] flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-[450px] flex flex-col gap-y-6">
                <img
                    src="/logo.png"
                    alt="Pay Small Small"
                    className="w-[200px] h-auto object-contain mx-auto"
                />
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Welcome Back!</h1>
                        <p className="text-slate-500 mt-2">Enter your details to login to your account</p>
                    </div>

                    <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@gmail.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm text-slate-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <a href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700">
                                Create an account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <CustomAlert 
                message={alert.message} 
                type={alert.type} 
                isOpen={alert.isOpen} 
                onClose={hideAlert} 
            />
        </div>
    );
};


export default LoginPage