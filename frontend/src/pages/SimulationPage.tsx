import { useState } from "react";
import { useToast } from "../context/ToastContext";
import type { SimResult } from "../interfaces/interfaces";
import { runSimulation } from "../services/api";



export default function SimulationPage() {

    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [sim, setSim] = useState<SimResult>()

    const handleRunSimulation = async () => {
        setIsLoading(true);
        try {
            const simResponse = await runSimulation();
            const result = simResponse.data;
            setSim(result);
            addToast(result.status || "Szimuláció sikeresen lefutott", "success");
         } catch (err: any) {
            console.error('Hiba a szimuláció során:', err);
            addToast(
                err.response?.data?.message || 
                err.message || 
                "Hiba történt a szimuláció futtatása közben",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="sim-card">
                <h3>🎲 Teszt adatok generálása</h3>
                <p>
                    Létrehoz osztályokat (Belgyógyászat, Sebészet, Neurológia), kórteremeket,
                    orvosokat, betegeket, felvételeket (aktív és lezárt egyaránt),
                    vizsgálatokat és diagnózisokat – felépítve a köztük lévő kapcsolatokat.
                    <br /><br />
                    <em>A meglévő adatok törlésre kerülnek.</em>
                </p>
                <button
                    className="btn btn-sim"
                    id="sim-btn"
                    onClick={handleRunSimulation}
                    disabled={isLoading}
                    >
                    {isLoading ? (
                        <>
                        <span className="spinner" /> Futtatás...
                        </>
                    ) : (
                        "⚡ Szimuláció indítása"
                    )}
                </button>
                
                {sim && (
                    <div className="sim-result">
                        {sim ? 
                            sim.message.map((m, i) => 
                                <div className="ok" key={`sim-data-${i}`}>
                                    ✓ {m}
                                </div>
                            )
                         : (
                            <p className="no-data">
                                Nem érkezett felhasználó adat a válaszban.
                            </p>)
                        }
                    </div>
                )}
            </div>
            
        </div>
    )
}