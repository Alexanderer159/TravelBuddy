import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "/api";

// const getToken = () => localStorage.getItem("token");
const getToken = () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTk0YjI3NjBlNmU4ZmU2MjI4ZmIyNyIsInVzZXJuYW1lIjoiYWxlamFuZHJvIiwiaWF0IjoxNzc2ODk2ODA3LCJleHAiOjE3Nzc1MDE2MDd9.sItkFeQY2dwwbbcnIgVW-ONwknFocxT3KdqZlgOAnK8"

async function uploadAndStore({ place, date, files, name }) {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));

  const uploadRes = await fetch(`${API}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });

  if (!uploadRes.ok) throw new Error("Upload failed");
  const { urls } = await uploadRes.json();

  const memRes = await fetch(`${API}/memories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ place, date, images: urls, name }),
  });

  if (!memRes.ok) throw new Error("Failed to save memory");
  return memRes.json();
}



const Pics = () => {
  const [memories, setMemories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    fetch(`${API}/memories`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setMemories(data))
      .catch(console.error);
  }, []);

  const openModal = () => {
    setPlace(""); setDate(""); setName(""); setFiles([]); setPreviews([]); setError(null);
    setModalOpen(true);
  };

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleStore = async () => {
    if (!place.trim() || !date || !name.trim() || files.length === 0) {
      setError("Please fill in all fields and add at least one picture.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const memory = await uploadAndStore({ place, date, files, name });
      setMemories((prev) => [memory, ...prev]);
      setModalOpen(false);
    } catch {
      setError("One or more uploads failed. Check your server and Cloudinary config.");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  const deleteMemory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    try {
      const res = await fetch(`${API}/memories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove from local state
      setMemories((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete memory. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
<Camera className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 -z-10 pointer-events-none text-neutral-400" size={650}/>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <p className="font-serif text-4xl font-normal">People's Memories</p>
        <button onClick={openModal} className="bg-gray-900 text-white rounded-xl p-4 text-sm font-medium transition-all duration-500 hover:scale-105 cursor-pointer">
          + Create memory
        </button>
      </div>

      {/* Memory list */}
      {memories.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 text-gray-700">
          <Camera size={50} />
          <p className="">No memories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {memories.map((mem) => (
            <div key={mem._id} className="group flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-100 pt-6">
              {/* Left — place & date */}
              <div className="sm:w-40 shrink-0 text-center">
                <p className="font-serif font-bold uppercase text-xl">{mem.name || "Unknown"}</p>
                <p className="font-medium text-gray-900 my-1">{mem.place}</p>
                <p className="text-sm text-gray-700">{formatDate(mem.date)}</p>

                {/* NEW: Delete Button */}
                <button onClick={() => deleteMemory(mem._id)}
                  className="text-xs text-gray-700 hover:text-red-600 mt-2 transition-all duration-500 cursor-pointer uppercase">Delete Memory</button>
              </div>

              {/* Right — photos row */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {mem.images.map((url, i) => (
                  <img key={i} src={url} className="h-24 w-28 sm:h-30 sm:w-35 object-cover rounded-xl shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg ">

            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-normal text-gray-900 ">New memory</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-300 hover:text-gray-600 text-3xl leading-none transition-all duration-500 cursor-pointer">
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {/* Person's Name */}
              <div>
                <label className="text-xs text-gray-700 uppercase tracking-wider block mb-2 text-center">Who was there?</label>
                <input type="text" placeholder="e.g. Alejandro" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-400 placeholder-gray-300"/>
              </div>

              {/* Place */}
              <div>
                <label className="text-xs text-gray-700 uppercase tracking-wider block mb-1.5 text-center">Where were you?</label>
                <input type="text" placeholder="e.g. Kyoto, Japan" value={place} onChange={(e) => setPlace(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-400 placeholder-gray-300"/>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-gray-700 uppercase tracking-wider block mb-1.5 text-center">When was it?</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-400"/>
              </div>

              {/* Upload area */}
              <div>
                <label className="text-xs text-gray-700 uppercase tracking-wider block mb-1.5 text-center">Your pictures</label>
                <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current.click()}
                  className="border border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-gray-400 hover:bg-stone-50 transition-all duration-500">
                  <p className="text-sm text-gray-400">Drop photos here or <span className="underline">browse</span></p>
                  <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)}/>
                </div>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap overflow-hidden h-50 justify-center">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} className="w-16 h-16 object-cover rounded-lg"/>
                      <button onClick={() => removeFile(i)}
                        className="cursor-pointer absolute -top-1.5 -right-1.5 bg-gray-900 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Submit */}
              <button onClick={handleStore} disabled={uploading}
                className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1">
                {uploading ? "Uploading..." : "Store memories"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pics;