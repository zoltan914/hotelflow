import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { createStaff, deleteStaff, getAllStaff, getAllWings, updateStaff } from "../services/api";
import { StaffRole, type Staff, type Wing } from "../interfaces/interfaces";
import { StaffFormFields } from "../components/StaffFormFields";

export type StaffForm = {
  id: number | null,
  name: string,
  role: StaffRole | null,
  email: string,
  wingId: number | null
}

const EMPTY_FORM: StaffForm = { 
  id: null,
  name: '',
  role: null,
  email: '',
  wingId: null
}
type CreateStaffData = Parameters<typeof createStaff>[0]
type UpdateStaffData = Parameters<typeof updateStaff>[1]


export default function StaffPage() {
    const { addToast } = useToast()
    const { isFormOpen, showForm, clear } = usePageControls();

    const [allWings, setAllWings] = useState<Wing[]>([])
    const [allStaff, setAllStaff] = useState<Staff[]>([])

    const [newStaff, setNewStaff] = useState<StaffForm>(EMPTY_FORM)
    const [editing, setEditing] = useState<StaffForm | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const [staffRes, wingsRes] = await Promise.all([getAllStaff(), getAllWings()])
            setAllStaff(staffRes.data)
            setAllWings(wingsRes.data)
        }
        fetchData()
    }, [])
    
    const updateNew = (field: keyof StaffForm, value: string | number | StaffRole | null) => {
        setNewStaff(prev => ({ ...prev, [field]: value }))
    }
    const updateEditing = (field: keyof Omit<StaffForm, 'id'>, value: string | number | StaffRole | null) =>
        setEditing(prev => prev ? { ...prev, [field]: value } : null)

    const startEditing = (p: Staff) =>
        setEditing({ id: p.id, name: p.name, role: p.role as StaffRole, email: p.email, wingId: p.wingId })

    const handleCreate = async () => {
        if (!newStaff.name.trim() || !newStaff.email.trim() || !newStaff.role || !newStaff.wingId) {
            addToast('Az összes mező kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdStaff = await createStaff(newStaff as CreateStaffData)
            setAllStaff(prev => [...prev, createdStaff.data])
            addToast('A személyzet sikeresen létrehozva');
            setNewStaff(EMPTY_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }
    
    const handleUpdate = async (staffId: number) => {
        if (!editing) return
        try {
            const {id, ...updateData} = editing
            const updatedStaff = await updateStaff(staffId, updateData as UpdateStaffData)
            setAllStaff(prev => prev.map(d => d.id === staffId ? updatedStaff.data : d))
            addToast('A személyzet adatai sikeresen frissítve')
            setEditing(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a személyzetet?')) return
        try {
            await deleteStaff(id)
            setAllStaff(prev => prev.filter(d => d.id !== id))
            addToast('A személyzet sikeresen törölve')
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Hiba történt a törlés során', 'error')
        }
    }

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Személyzet</h2>
                <button className="btn btn-primary" onClick={showForm}>＋</button>
                <button className="btn btn-ghost" onClick={clear}><span>✕</span></button>
            </div>
            <p className="page-desc">Személyzet létrehozása, szerkesztése, törlése.</p>

            {isFormOpen && <StaffFormFields
                wings={allWings}
                isEditing={false}
                valueState={newStaff}
                onUpdate={updateNew}
                onCreate={handleCreate}
                onClose={clear}
            />}

            <div className="card-grid">
                {allStaff.map(staff => {
                    const isEditing = editing?.id === staff.id
                    return (
                        <div className="card" key={`staff-card-${staff.id}`}>
                            <div className="card-header">
                                <div className="card-name">{staff.name}</div>
                                <div className="card-meta">
                                    <span className="badge blue" title="Beosztás">
                                        {StaffRole[staff.role]}
                                    </span>
                                    &nbsp;&nbsp;<span className="badge gold" title="szobák száma">
                                        {allWings.find(w => w.id === staff.wingId)?.name}
                                    </span>
                                </div>
                            </div>
                            <div className="card-sub"><strong>Email:</strong> {staff.email}</div>

                            {isEditing && <StaffFormFields
                                wings={allWings} 
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(staff.id)}
                                onClose={() => setEditing(null)}
                            />}

                            <div className="card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(staff)}>✏️ Szerkesztés</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(staff.id)}>🗑 Törlés</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}