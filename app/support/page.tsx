"use client";
import React, { useState } from "react";

const ContactForm = () => {
    // Existing state and functions...
   
    const goBack = () => {
       window.history.back();
    };
   
    return (
       <div className="flex justify-center items-center w-full h-full">
         <div className="w-full max-w-lg space-y-8">
           <div className="space-y-2">
             <button onClick={goBack} className="text-blue-500 hover:text-blue-700">Go Back</button>
             <h1 className="text-3xl font-bold">Support Form</h1>
             <p className="text-gray-500 dark:text-gray-400">
               Reach out to us with your questions or issues.
             </p>
             {/* Add the non-functional message and email link here */}
             <p>Note: This form is currently non-functional. Please email us directly at <a href="mailto:oreowen116@gmail.com">oreowen116@gmail.com</a> for support.</p>
           </div>
           {/* Existing form and submitted message... */}
         </div>
       </div>
    );
   };
   
   export default ContactForm;