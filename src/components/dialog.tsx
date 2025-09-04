

import React, { createContext, useContext, useState, useEffect } from "react"
import { DialogContextType, DialogProps } from "../lib/types"

const DialogContext = createContext<DialogContextType | undefined>(undefined)
export function Dialog({ children, open, onOpenChange }: DialogProps) {
    const [isOpen, setIsOpen] = useState(open || false)
  
    useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open)
      }
    }, [open])
  
    // useEffect(() => {
    //   if (onOpenChange) {
    //     onOpenChange(isOpen)
    //   }
    // }, [isOpen, onOpenChange])
  
    const contextValue: DialogContextType = {
      isOpen,
      setIsOpen: (value) => {
        const newIsOpen = typeof value === "function" ? value(isOpen) : value
        setIsOpen(newIsOpen)
        if (onOpenChange) {
          onOpenChange(newIsOpen)
        }
      },
    }
  
    return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>
  }
  
  export function DialogTrigger({ children }: { children: React.ReactNode }) {
    const context = useContext(DialogContext)
    if (!context) throw new Error("DialogTrigger must be used within a Dialog")
  
    return <div onClick={() => context.setIsOpen(true)}>{children}</div>
  }
  
  export function DialogContent({ children, ...rest }: { children: React.ReactNode }) {
    const context = useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within a Dialog")
  
    if (!context.isOpen) return null
  
    return (
        <div className="fixed inset-0 z-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => context.setIsOpen(false)} />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl z-auto relative p-5">{children}</div>
        </div>
      )
  }
  
  export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="px-2 py-3 border-b-3 border-blue-600 mr-2">{children}</div>
  }
  
  export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold ">{children}</h2>
  }
  
  export function DialogDescription({ children }: { children: React.ReactNode }) {
    return <div className="mt-2 text-sm text-gray-500 mr-4">{children}</div>
  }
  
  export function DialogClose() {
    const context = useContext(DialogContext)
    if (!context) throw new Error("DialogClose must be used within a Dialog")
  
    return (
      <button
        onClick={() => context.setIsOpen(false)}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
      >
        {"X"}
        <span className="sr-only">Close</span>
      </button>
    )
  }
  
  export function DialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">{children}</div>
  }

