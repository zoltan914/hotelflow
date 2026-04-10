import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { type ServiceRequest, ServiceType, type Guest, type Staff, GuestTier } from "../interfaces/interfaces";
import { createServiceRequest, deleteServiceRequest, getAllGuests, getAllServiceRequest, getAllStaff } from "../services/api";
import { ServiceFormFields } from "../components/ServiceFormFields";
import { toLocalDateString } from "../utils/dateutils";
import { SearchInput } from "../components/SearchInput";
import { normalize } from "../utils/textutils";

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
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState("");

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

    const filteredServices = useMemo(() => {
        const cleanSearch = normalize(debouncedSearch)
        return allServices
                .filter(service => !selectedServiceType || service.type === selectedServiceType as any)
                .filter(service => 
                    allStaff.some(staff => staff.id === service.staffId && normalize(staff.name).includes(cleanSearch))
                )
    }, [allServices, allStaff, selectedServiceType, debouncedSearch])
    
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

    const handleDelete = async (serviceId: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt az szolgáltatást?')) return
        try {
            await deleteServiceRequest(serviceId)
            setAllServices(prev => prev.filter(service => service.id !== serviceId))
            addToast('A szolgáltatás sikeresen törölve')
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Hiba történt a törlés során', 'error')
        }
    }
    
    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Szolgáltatások</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={showFilterBar}><span>🔍</span></button>
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                    setNewServiceRequest(EMPTY_FORM)
                    setSelectedServiceType(null)
                    setDebouncedSearch('')
                }}> ✕ </button>
            </div>
            <p className="page-desc">Szolgáltatások kérése, megtekintése, törlése.</p>

            {isFormOpen && <ServiceFormFields
                valueState={newServiceRequest}
                onUpdate={updateNewServiceRequest}
                onCreate={handleCreate}
                onClose={clear}
            />}

            {isFilterBarOpen &&
                <div className="filter-controls">
                    <div className="filter-bar">
                        <div className="elem">
                            <div className={`filter-chip ${selectedServiceType === null ? 'active' : ''}`} onClick={() => setSelectedServiceType(null)}>Összes</div>
                            {Object.entries(ServiceType).map(([key, value]) => {
                                const roomType = Object.keys(ServiceType).find(o => o === key) as ServiceType
                                return (
                                    <div 
                                        key={`filter-roomtype-${key}`} 
                                        className={`filter-chip ${selectedServiceType === roomType ? 'active' : ''}`} 
                                        onClick={() => setSelectedServiceType(roomType)}
                                    >
                                        {value}
                                    </div>
                            )})}
                        </div>
                        <div className="elem">
                            <label className="bold">Keresés személyzet alapján</label>
                            <SearchInput
                                value={debouncedSearch}
                                onSearch={(val) => setDebouncedSearch(val)} 
                                placeholder="Keress személyzet alapján..."
                            />
                        </div>
                        <div className="elem">
                            <button className="btn btn-ghost" onClick={() => {
                                setSelectedServiceType(null)
                                setDebouncedSearch('')
                            }}>Alaphelyzet</button>
                        </div>
                    </div>
                </div>
            }

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Vendég</th>
                            <th>Vendégkatagória</th>
                            <th>Személyzet</th>
                            <th>Kérés dátuma</th>
                            <th>Típus</th>
                            <th>Leírás</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map(service => {
                            const guestTier = allGuests.find(g => g.id === service.guestId)?.tier as keyof typeof GuestTier
                            return (
                                <tr key={`service-${service.id}`}>
                                    <td>{allGuests.find(g => g.id === service.guestId)?.name}</td>
                                    <td>
                                        <span 
                                          className={`badge ${
                                            GuestTier[guestTier] === GuestTier.GOLD ? 'gold' : 
                                            GuestTier[guestTier] === GuestTier.PLATINUM ? 'blue'
                                            : ''}`}
                                        >
                                            {GuestTier[guestTier]}
                                        </span>
                                    </td>
                                    <td>{allStaff.find(s => s.id === service.staffId)?.name}</td>
                                    <td>{service.requestDate?.toString()}</td>
                                    <td>{ServiceType[service.type]}</td>
                                    <td>{service?.description}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(service.id)}>🗑 Törlés</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}