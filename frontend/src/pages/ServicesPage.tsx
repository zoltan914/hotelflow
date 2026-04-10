import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { type ServiceRequest, ServiceType, type Guest, type Staff } from "../interfaces/interfaces";
import { createServiceRequest, getAllGuests, getAllServiceRequest, getAllStaff } from "../services/api";
import { ServiceFormFields } from "../components/ServiceFormFields";
import { toLocalDateString } from "../utils/dateutils";

export type ServiceForm = {
    guestId: number | null
    staffId: number | null
    requestDate: Date | null
    type: ServiceType | null
    description: string
}

const EMPTY_FORM : ServiceForm = {
    guestId: null,
    staffId: null,
    requestDate: null,
    type: null,
    description: ''
}

export default function ServicesPage() {
    const { addToast } = useToast()
    const { isFormOpen, showForm, clear, showFilterBar, isFilterBarOpen } = usePageControls();
    
    const [allServices, setAllServices] = useState<ServiceRequest[]>([])
    const [allGuests, setAllGuests] = useState<Guest[]>([])
    const [allStaff, setAllStaff] = useState<Staff[]>([])

    const [newServiceRequest, setNewServiceRequest] = useState<ServiceForm>(EMPTY_FORM)
    const updateNewServiceRequest = (field: keyof ServiceForm, value: string | number | Date | ServiceType | null) => {
        setNewServiceRequest(prev => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        const fetchData = async () => {
            const [servicesRes, staffRes, guestRes] 
                    = await Promise.all([getAllServiceRequest(), getAllStaff(), getAllGuests()])
            setAllServices(servicesRes.data)
            setAllStaff(staffRes.data)
            setAllGuests(guestRes.data)
        }
        fetchData()
    }, [])

    const handleCreate = async () => {
        if (!newServiceRequest.guestId || !newServiceRequest.staffId || !newServiceRequest.requestDate || !newServiceRequest.type) {
            addToast('A mezők kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdService = await createServiceRequest({
                ...newServiceRequest,
                requestDate: new Date(toLocalDateString(newServiceRequest.requestDate))
            })
            setAllServices(prev => [...prev, createdService.data])
            addToast('A szolgáltatáskérés sikeres');
            setNewServiceRequest(EMPTY_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }
    

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Szolgáltatások</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                }}> ✕ </button>
            </div>
            <p className="page-desc">Szolgáltatások kérése, megtekintése, törlése.</p>

            {isFormOpen && <ServiceFormFields
                valueState={newServiceRequest}
                onUpdate={updateNewServiceRequest}
                onCreate={handleCreate}
                onClose={clear}
            />}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Vendég</th>
                            <th>Személyzet</th>
                            <th>Kérés dátuma</th>
                            <th>Típus</th>
                            <th>Leírás</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allServices.map(service => {
                            return (
                                <tr key={`service-${service.id}`}>
                                    <td>{allGuests.find(g => g.id === service.guestId)?.name}</td>
                                    <td>{allStaff.find(s => s.id === service.staffId)?.name}</td>
                                    <td>{service.requestDate?.toString()}</td>
                                    <td>{ServiceType[service.type]}</td>
                                    <td>{service?.description}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}