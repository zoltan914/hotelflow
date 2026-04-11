import { useEffect, useState } from "react"
import { createWing, deleteWing, getAllWings, updateWing } from "../services/api"
import { type Wing } from "../interfaces/interfaces"
import { useToast } from "../context/ToastContext"
import { usePageControls } from "../hooks/usePageControls"
import { WingFormFields } from "../components/formfields/WingFormFields"


export type WingForm = {
  id: number | null,
  name: string,
  description: string,
  managerName: string
}

const EMPTY_FORM: WingForm = { 
  id: null,
  name: '',
  description: '',
  managerName: '',
}

type CreateWingData = Parameters<typeof createWing>[0]
type UpdateWingData = Parameters<typeof updateWing>[1]


export default function WingsPage() {

    const { addToast } = useToast()
    const { isFormOpen, showForm, clear } = usePageControls();

    const [allWings, setAllWings] = useState<Wing[]>([])
    const [editing, setEditing] = useState<WingForm | null>(null)

    const [newWing, setNewWing] = useState<WingForm>(EMPTY_FORM)

    useEffect(() => {
        const fetchData = async () => {
            const wingsRes = await getAllWings()
            setAllWings(wingsRes.data)
        }
        fetchData()
    }, [])


    const updateNew = (field: keyof WingForm, value: string | null) => {
        setNewWing(prev => ({ ...prev, [field]: value }))
    }
    const updateEditing = (field: keyof Omit<WingForm, 'id'>, value: string | null) =>
        setEditing(prev => prev ? { ...prev, [field]: value } : null)

    const startEditing = (p: Wing) =>
        setEditing({ id: p.id, name: p.name, description: p.description, managerName: p.managerName })

    const handleCreate = async () => {
        if (!newWing.name.trim() || !newWing.description.trim() || !newWing.managerName.trim()) {
            addToast('Az összes mező kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdWing = await createWing(newWing as CreateWingData)
            setAllWings(prev => [...prev, createdWing.data])
            addToast('Az szárny sikeresen létrehozva');
            setNewWing(EMPTY_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleUpdate = async (wingId: number) => {
        if (!editing) return
        try {
            const {id, ...updateData} = editing
            const updatedWing = await updateWing(wingId, updateData as UpdateWingData)
            setAllWings(prev => prev.map(d => d.id === wingId ? updatedWing.data : d))
            addToast('A szárny adatai sikeresen frissítve')
            setEditing(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }
    
    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a szárnyat?')) return
        try {
            await deleteWing(id)
            setAllWings(prev => prev.filter(d => d.id !== id))
            addToast('A szárny sikeresen törölve')
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Hiba történt a törlés során', 'error')
        }
    }

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Szárnyak</h2>
                <button className="btn btn-primary" onClick={showForm}>＋</button>
                <button className="btn btn-ghost" onClick={clear}><span>✕</span></button>
            </div>
            <p className="page-desc">Szárnyak létrehozása, szerkesztése, törlése.</p>

            {isFormOpen && <WingFormFields
                isEditing={false}
                valueState={newWing}
                onUpdate={updateNew}
                onCreate={handleCreate}
                onClose={clear}
            />}

            <div className="card-grid">
                {allWings.map(wing => {
                    const isEditing = editing?.id === wing.id
                    return (
                        <div className="card" key={`wing-card-${wing.id}`}>
                            <div className="card-header">
                                <div className="card-name">{wing.name}</div>
                                <div className="card-meta">
                                    <span className="badge blue" title="személyzet száma">{wing.staffCount}</span>
                                    &nbsp;&nbsp;<span className="badge gold" title="szobák száma">{wing.roomCount}</span>
                                </div>
                            </div>
                            <div className="card-sub">Manager: <strong>{wing.managerName}</strong></div>
                            <div className="card-sub">{wing.description}</div>

                            {isEditing && <WingFormFields 
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(wing.id)}
                                onClose={() => setEditing(null)}
                            />}

                            <div className="card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(wing)}>✏️ Szerkesztés</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(wing.id)}>🗑 Törlés</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}