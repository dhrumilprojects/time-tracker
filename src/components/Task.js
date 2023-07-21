import React, { useEffect, useState } from "react";
import { deleteDoc, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore'
import { BsCircleFill } from "react-icons/bs";
import {
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlineCalendar,
    AiOutlinePlayCircle,
    AiOutlinePauseCircle,
    AiOutlineReload,
} from "react-icons/ai";
import {
    FaCheck,
    FaTimes
} from "react-icons/fa";
import app from "../firebase/config";
import { format } from 'date-fns'

const db = getFirestore(app)

function Task({ task }) {
    const [localTask, setLocalTask] = useState(task);
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState(localTask.task);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewTaskDescription(localTask.task);
    };

    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, "tasks", localTask.id), {
                task: newTaskDescription,
            });
            setLocalTask((prevSate) => ({ ...prevSate, task: newTaskDescription }));
            setIsEditing(false);
        } catch (error) { }
    };

    const renderTaskDescription = () => {
        if (isEditing) {
            return (
                <div className="flex space-x-2">
                    <input className="border border-purple-300 rounded px-2 py-1" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} />
                    <FaCheck
                        onClick={handleUpdate}
                        className="text-green-400 cursor-pointer"
                    />
                    <FaTimes
                        onClick={handleCancelEdit}
                        className="text-red-400 cursor-pointer"
                    />
                </div>
            )
        }
        return <p className="text-gray-600">{task.task}</p>
    }

    const handleStart = async () => {
        try {
            await updateDoc(doc(db, "tasks", localTask.id), {
                status: "in_progress",
                startTime: Date.now(),
            });
            const taskDoc = doc(db, "tasks", localTask.id);
            onSnapshot(taskDoc, (docSnap) => {
                if (docSnap.exists()) {
                    setLocalTask({
                        ...docSnap.data(),
                        date: localTask.date,
                        id: localTask.id,
                    });
                }
            });
        } catch (error) {
            console.log("Error starting task:", error);
        }
    };


    const handlePause = async () => {
        try {
            const elapsed = localTask.startTime
                ? Date.now() - localTask.startTime
                : 0;
            const newTotalTime = (localTask.totalTime || 0) + elapsed;
            await updateDoc(doc(db, "tasks", localTask.id), {
                status: "paused",
                endTime: Date.now(),
                totalTime: newTotalTime,
            });
            const taskDoc = doc(db, "tasks", localTask.id);
            onSnapshot(taskDoc, (docSnap) => {
                if (docSnap.exists()) {
                    setLocalTask({
                        ...docSnap.data(),
                        date: localTask.date,
                        id: localTask.id,
                    });
                }
            });
        } catch (error) {
            console.log("Error pausing task:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "tasks", localTask.id));
            alert("Task Deleted successfully");
        } catch (error) {
            alert("Task Deleted failed");
        }
    };

    const handleRenderButtons = () => {
        console.log(localTask)
        switch (localTask.status) {
            case 'unstarted':
                return (
                    <AiOutlinePlayCircle className="text-2xl text-purple-400" onClick={handleStart} />
                );
            case 'in_progress':
                return (
                    <AiOutlinePauseCircle className="text-2xl text-green-400" onClick={handlePause} />
                );
            default:
                return (
                    <AiOutlineReload className="text-2xl text-green-400" onClick={handleStart} />
                );
        }
    };
    return (
        <div className="bg-white p-4 rounded-md text-black shadow-lg flex flex-col md:flex-row md:items-center justify-between">
            <div className="md:space-x-2 space-y-2 md:space-y-0">
                {renderTaskDescription()}
                <div className="flex items-center space-x-2">
                    <AiOutlineCalendar className="text-gray-600" />
                    <p className="text-gray-600">
                        {format(new Date(localTask.date), "do MMM yyyy")}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2 justify-center">
                <BsCircleFill color={localTask.status === 'paused' ? 'red' : localTask.status === 'in_progress' ? 'green' : 'yellow'} />
                <p>{localTask.status}</p>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-end">
                {handleRenderButtons()}
                <AiOutlineEdit className="text-2xl text-purple-400 cursor-pointer" onClick={handleEdit} />
                <AiOutlineDelete className="text-2xl text-red-500 cursor-pointer" onClick={handleDelete} />
            </div>
        </div>
    );
}

export default Task;