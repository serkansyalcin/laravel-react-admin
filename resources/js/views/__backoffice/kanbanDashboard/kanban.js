import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from '../../../models/Task';

const KanbanBoard = () => {
    const [pagination, setPagination] = useState({});
    const [tasks, setTasks] = useState({
        pending: [],
        in_progress: [],
        completed: [],
    });

    const fetchUsers = async (params = {}) => {
        try {
            const { page, perPage, sortBy, sortType, filters: newFilters } = params;
            const queryParams = { page, perPage, sortBy, sortType, ...newFilters };
            const pagination = await Task.paginated(queryParams);
            setPagination(pagination.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (pagination && pagination.length) {
            const pendingTasks = pagination.filter(task => task.status === 'pending');
            const inProgressTasks = pagination.filter(task => task.status === 'in_progress');
            const completedTasks = pagination.filter(task => task.status === 'completed');

            setTasks({
                pending: pendingTasks,
                in_progress: inProgressTasks,
                completed: completedTasks,
            });
        }
    }, [pagination]);

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await Task.updateStatus(taskId, { status: newStatus });
        } catch (error) {
            console.error('An error occurred while updating the task status.');
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceList = Array.from(tasks[source.droppableId]);
        const [removed] = sourceList.splice(source.index, 1);
        const destList = Array.from(tasks[destination.droppableId]);

        destList.splice(destination.index, 0, removed);

        setTasks({
            ...tasks,
            [source.droppableId]: sourceList,
            [destination.droppableId]: destList,
        });
        if (source.droppableId !== destination.droppableId) {
            const newStatus = destination.droppableId;
            updateTaskStatus(removed.id, newStatus);
        }
    };
    const getColumnStyle = (status) => ({
        margin: '0 10px',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#f5f5f5',
        flex: 1,
        minHeight: '500px',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e0e0e0',
    });

    const getTaskStyle = (status) => ({
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        color: '#333',
        marginBottom: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
    });

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        padding: '20px',
    };

    const headingStyle = {
        color: '#333',
        fontSize: '18px',
        fontWeight: '600',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '20px',
    };

    const statusColors = {
        pending: '#ffcc00', // Soft yellow for pending
        in_progress: '#3399ff', // Soft blue for in-progress
        completed: '#66cc66', // Soft green for completed
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={containerStyle}>
                {Object.keys(tasks).map((status) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getColumnStyle(status)}
                            >
                                <h3 style={{ ...headingStyle, borderColor: statusColors[status] }}>
                                    {status.replace('_', ' ').toUpperCase()}
                                </h3>
                                {tasks[status].length > 0 ? (
                                    tasks[status].map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...getTaskStyle(status),
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    <p>{task.user ? task.user.name : 'Unassigned'}</p>
                                                    <p>{task.title ? task.title : ''}</p>
                                                    <p>{task.content || task.description}</p>
                                                    <p>Start Date: <small>{task.start_date}</small></p>
                                                    <p>End Date: <small>{task.end_date}</small></p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    <p>No tasks in this category</p>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
