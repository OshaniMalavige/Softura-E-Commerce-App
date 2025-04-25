"use client"

import Image from "next/image";
import { Field, Label, Switch } from '@headlessui/react'
import {useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import Header from "@/components/theme/Header.js";
import Footer from "@/components/theme/Footer.js";

const ContactUs = () =>{
    const [agreed, setAgreed] = useState(false)

    return (
        <>
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-white px-4">
                <div
                    className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-7xl h-[90vh]">
                    <div className="w-full md:w-1/2 h-1/3 md:h-full">
                        <Image
                            src="/assests/signup.gif"
                            alt="Signup Illustration"
                            width={800}
                            height={800}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <form className="mx-auto max-w-xl">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block font-medium text-gray-700">
                                        First name
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone-number" className="block font-medium text-gray-700">
                                        Phone number
                                    </label>
                                    <div className="mt-2.5">
                                        <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                                                <select
                                                    id="country"
                                                    name="country"
                                                    autoComplete="country"
                                                    aria-label="Country"
                                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                >
                                                    <option>US</option>
                                                    <option>CA</option>
                                                    <option>EU</option>
                                                </select>
                                                <FaChevronDown
                                                    aria-hidden="true"
                                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                />
                                            </div>
                                            <input
                                                id="phone-number"
                                                name="phone-number"
                                                type="text"
                                                placeholder="123-456-7890"
                                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block font-medium text-gray-700">
                                        Message
                                    </label>
                                    <div className="mt-2.5">
              <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-950"
                  defaultValue={''}
              />
                                    </div>
                                </div>
                                <Field className="flex gap-x-4 sm:col-span-2">
                                    <div className="flex h-6 items-center">
                                        <Switch
                                            checked={agreed}
                                            onChange={setAgreed}
                                            className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 data-checked:bg-blue-900"
                                        >
                                            <span className="sr-only">Agree to policies</span>
                                            <span
                                                aria-hidden="true"
                                                className="size-4 transform rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-checked:translate-x-3.5"
                                            />
                                        </Switch>
                                    </div>
                                    <Label className="text-sm/6 text-gray-600">
                                        By selecting this, you agree to our{' '}
                                        <a href="#" className="font-semibold text-blue-900">
                                            privacy&nbsp;policy
                                        </a>
                                        .
                                    </Label>
                                </Field>
                            </div>
                            <div className="mt-10">
                                <button
                                    type="submit"
                                    className="block w-full rounded bg-blue-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                                >
                                    Let&#39;s talk
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
);
}

export default ContactUs