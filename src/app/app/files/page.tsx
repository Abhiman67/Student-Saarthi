"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Bot,
  ArrowRight,
  Eye,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  extractedText?: string | null;
  summary?: string | null;
  flashcards?: string | null;
  quiz?: string | null;
  status: string;
  createdAt: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        if (data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0]);
        }
      }
    } catch {
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "File upload failed");
        setUploading(false);
        return;
      }

      setFiles((prev) => [data.file, ...prev]);
      setSelectedFile(data.file);
      setSuccess(`Successfully uploaded and processed "${data.file.name}"`);
    } catch {
      setError("Network error during file upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this study file?")) return;
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAction = async (action: "summary" | "flashcards" | "quiz") => {
    if (!selectedFile) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/files/${selectedFile.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedFile((prev: any) => ({
          ...prev,
          summary: action === "summary" ? data.summary : prev.summary,
          flashcards: action === "flashcards" ? JSON.stringify(data.flashcards) : prev.flashcards,
          quiz: action === "quiz" ? JSON.stringify(data.quiz) : prev.quiz,
        }));
        // Update in list
        setFiles((prev) =>
          prev.map((f) =>
            f.id === selectedFile.id
              ? {
                  ...f,
                  summary: action === "summary" ? data.summary : f.summary,
                  flashcards: action === "flashcards" ? JSON.stringify(data.flashcards) : f.flashcards,
                  quiz: action === "quiz" ? JSON.stringify(data.quiz) : f.quiz,
                }
              : f
          )
        );
      } else {
        setError(data.error?.message || "Action failed");
      }
    } catch {
      setError("Network error while generating study materials");
    } finally {
      setActionLoading(false);
    }
  };

  // Parse flashcards & quiz if present
  let flashcardsList: any[] = [];
  if (selectedFile?.flashcards) {
    try {
      flashcardsList = JSON.parse(selectedFile.flashcards);
    } catch {}
  }

  let quizList: any[] = [];
  if (selectedFile?.quiz) {
    try {
      quizList = JSON.parse(selectedFile.quiz);
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Study Files & Documents</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload course notes, syllabi, and lab manuals to generate summaries, active recall cards, and quizzes.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 cursor-pointer transition">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing File...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Files Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Files List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Uploaded Materials ({files.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">PDF, DOCX, TXT, MD</span>
          </h2>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
              No study files uploaded yet. Click Upload Document above.
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                    selectedFile?.id === file.id
                      ? "border-indigo-500 bg-indigo-50/50 shadow-xs"
                      : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText
                      className={`h-4 w-4 flex-shrink-0 ${
                        selectedFile?.id === file.id ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                    title="Delete file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected File Study Center */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedFile ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
              Select or upload a file to view text extraction and generate study materials.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              {/* File details & Study actions bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedFile.name}</h2>
                  <p className="text-xs text-slate-500">
                    Status: <span className="font-semibold text-emerald-600">{selectedFile.status}</span> •{" "}
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <Link
                  href={`/app/agents/study-coach?conversationId=`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Discuss With Study Coach</span>
                </Link>
              </div>

              {/* Action Buttons: Summary, Flashcards, Quiz */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleRunAction("summary")}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Generate Summary</span>
                </button>

                <button
                  onClick={() => handleRunAction("flashcards")}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span>Active Recall Flashcards</span>
                </button>

                <button
                  onClick={() => handleRunAction("quiz")}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Generate Practice Quiz</span>
                </button>
              </div>

              {actionLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing document content and extracting key study takeaways...</span>
                </div>
              )}

              {/* Generated Summary Card */}
              {selectedFile.summary && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> Document Study Overview
                  </h3>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedFile.summary}
                  </div>
                </div>
              )}

              {/* Generated Flashcards */}
              {flashcardsList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-blue-600" /> Active Recall Flashcards ({flashcardsList.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {flashcardsList.map((fc, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition"
                      >
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">Q{i + 1}</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">{fc.question}</p>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Answer: </span>
                          {fc.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Practice Quiz */}
              {quizList.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-emerald-600" /> Practice Quiz Questions
                  </h3>
                  <div className="space-y-3">
                    {quizList.map((q, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                      >
                        <p className="text-xs font-bold text-slate-900 mb-2">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options?.map((opt: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              className={`rounded-lg px-3 py-1.5 text-xs border ${
                                optIdx === q.answer
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {opt} {optIdx === q.answer && "✓ (Correct Answer)"}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[11px] text-slate-500 mt-2 italic">
                            Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Text Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Raw Extracted Text Preview
                </h3>
                <div className="text-[11px] font-mono text-slate-600 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {selectedFile.extractedText || "No text extracted"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
