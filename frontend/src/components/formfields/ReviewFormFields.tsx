import type { ReviewForm } from "../../pages/BookingsPage";



interface ReviewFormFieldsProps {
    valueState: ReviewForm | null;
    onUpdate: (field: keyof ReviewForm, value: string | number | null) => void;
    onCreate: () => void;
    onClose: () => void;
}
export const ReviewFormFields = ({ valueState, onUpdate, onCreate, onClose } :ReviewFormFieldsProps) => {

    return (
        <>
            <tr className="review-block">
                <td className="rating-display" colSpan={2} >
                    <label>Csillagok</label>
                    <input 
                        type="number"
                        max={5}
                        min={1}
                        value={valueState?.stars}
                        onChange={e => onUpdate('stars', Number(e.target.value))}
                    />
                </td>
                <td className="review-comment" colSpan={3}>
                    <label>Mejegyzés</label>
                    <textarea
                        value={valueState?.comment}
                        onChange={e => onUpdate('comment', e.target.value)}
                    />
                </td>
                <td className="review-requests" colSpan={3}>
                    <label>Speciális kérések</label>
                    <textarea 
                        value={valueState?.specialRequests}
                        onChange={e => onUpdate('specialRequests', e.target.value)}
                    />
                </td>
            </tr>
            <tr className="review-block">
                <td colSpan={8}>
                    <button className="btn btn-primary" onClick={onCreate}
                        style={{marginRight: '10px'}}>Mentés</button>
                    <button className="btn btn-primary" onClick={onClose}>
                        ✕
                    </button>
                </td>
            </tr>
        </>
    )
}