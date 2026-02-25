"use client"

import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .font-geist { font-family: 'Inter', sans-serif !important; }
        .beautiful-shadow {
            box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
            0 6.7px 5.3px rgba(0, 0, 0, 0.048),
            0 12.5px 10px rgba(0, 0, 0, 0.06),
            0 22.3px 17.9px rgba(0, 0, 0, 0.072),
            0 41.8px 33.4px rgba(0, 0, 0, 0.086),
            0 100px 80px rgba(0, 0, 0, 0.12);
        }
        .custom-input {
            transition: all 0.3s ease;
        }
        .custom-input:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            border-color: #6366f1;
        }
        .login-btn {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            position: relative;
            overflow: hidden;
        }
        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .login-btn:hover::before {
            left: 100%;
        }
        .brand-side {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
        }
        .brand-side::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .feature-item {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.8s ease-out forwards;
        }
        .feature-item:nth-child(1) { animation-delay: 0.2s; }
        .feature-item:nth-child(2) { animation-delay: 0.4s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }
        .feature-item:nth-child(4) { animation-delay: 0.8s; }
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}</style>

      <div className="min-h-screen flex relative z-10 bg-stone-200 p-4 items-center justify-center">
          <div className="max-w-6xl w-full">
              {/* Main Card */}
              <div className="rounded-[40px] overflow-hidden beautiful-shadow bg-white">
                  <div className="grid lg:grid-cols-2 min-h-[700px]">
                      {/* Left Side - Brand/Features */}
                      <div className="brand-side hidden lg:flex flex-col text-white bg-cover p-8 lg:p-12 justify-between m-3 lg:m-4 rounded-3xl">
                          <div className="relative z-10">
                              {/* Logo */}
                              <div className="flex text-sm mb-12 items-center uppercase">
                                  <div className="text-lg font-semibold tracking-tight font-geist">CRM</div>
                              </div>

                              {/* Hero Text */}
                              <div className="mb-8 lg:mb-12">
                                  <h1 className="text-3xl lg:text-6xl font-medium tracking-tight font-geist mb-4">
                                      Customer Relationship Management
                                  </h1>
                                  <p className="text-base lg:text-xl leading-relaxed text-white/80 font-geist">
                                      Customer relationship management system, supporting Marketing, Sales, Customer Service, and Finance.
                                  </p>
                              </div>

                              {/* Features */}
                              <div className="space-y-4 lg:space-y-6">
                                  <div className="feature-item flex items-center">
                                      <div className="w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 bg-white/20">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud w-4 h-4 text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                                      </div>
                                      <div>
                                          <div className="font-semibold font-geist">Cloud Storage</div>
                                          <div className="text-sm text-white/70 font-geist">Access your projects from anywhere</div>
                                      </div>
                                  </div>
                                  <div className="feature-item flex items-center">
                                      <div className="w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 bg-white/20">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4 text-white"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                                      </div>
                                      <div>
                                          <div className="font-semibold font-geist">Database</div>
                                          <div className="text-sm text-white/70 font-geist">Using service <b className="font-bold">Supbase</b> with <b className="font-bold">Postgres database</b></div>
                                      </div>
                                  </div>
                                   <div className="feature-item flex items-center">
                                      <div className="w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 bg-white/20">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-4 h-4 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                      </div>
                                      <div className="">
                                          <div className="font-semibold font-geist">Backend Nestjs</div>
                                          <div className="text-sm text-white/70 font-geist">Using <b className="font-bold">Render</b> deployment</div>
                                      </div>
                                  </div>
                                   <div className="feature-item flex items-center">
                                      <div className="w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 bg-white/20">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette w-4 h-4 text-white"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
                                      </div>
                                      <div className="">
                                          <div className="font-semibold font-geist">Frontend Nextjs</div>
                                          <div className="text-sm text-white/70 font-geist">Using <b className="font-bold">Vercel</b> deployment</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Right Side - Form Container */}
                      <div className="flex flex-col p-6 lg:p-12 justify-center">
                          <div className="max-w-md mx-auto w-full">
                              {children}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}
