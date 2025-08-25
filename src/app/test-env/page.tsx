'use client';

import { useState, useEffect } from 'react';

async function getEnvVariables() {
    'use server';
    // This server action will attempt to load and return the env vars.
    // Note: In a real app, never expose secret keys to the client. This is for diagnostics only.
    require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
    return {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    };
}

export default function TestEnvPage() {
    const [envVars, setEnvVars] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEnvVariables().then(vars => {
            setEnvVars(vars);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Environment Variable Test Page</h1>
                <p className="text-gray-500">Use this page to diagnose if your .env file is being loaded correctly.</p>
            </div>

            <div className="max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Supabase Environment Variables</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">NEXT_PUBLIC_SUPABASE_URL</label>
                            <div className={`mt-1 p-2 rounded text-sm ${envVars?.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                {envVars?.NEXT_PUBLIC_SUPABASE_URL ? `Loaded: ${envVars.NEXT_PUBLIC_SUPABASE_URL}` : 'NOT FOUND'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                            <div className={`mt-1 p-2 rounded text-sm ${envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                {envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `Loaded: ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : 'NOT FOUND'}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-700">
                           {(!envVars?.NEXT_PUBLIC_SUPABASE_URL || !envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? (
                                <p className="text-red-400">
                                    <strong>Action Required:</strong> One or more environment variables are missing. Please ensure your <strong>.env</strong> file exists in the root of your project and contains the correct Supabase URL and Anon Key.
                                </p>
                           ) : (
                               <p className="text-green-400">
                                   <strong>Success:</strong> Both Supabase environment variables were loaded successfully. If you are still seeing errors elsewhere, the issue may be related to the module import order.
                               </p>
                           )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
