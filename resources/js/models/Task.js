import axios from 'axios';

export default class Task {
    /**
     * Fetch a paginated task list.
     *
     * @param {object} params
     *
     * @return {object}
     */
    static async paginated(params = {}) {
        const response = await axios.get('/api/v1/tasks', {
            params,
        });

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Store a new task.
     *
     * @param {object} attributes
     *
     * @return {object}
     */
    static async store(attributes) {
        const response = await axios.post('/api/v1/tasks', attributes);

        if (response.status !== 201) {
            return {};
        }

        return response.data;
    }

    static async delete(id) {
        const response = await axios.delete(`/api/v1/tasks/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    static async show(id) {
        const response = await axios.get(`/api/v1/tasks/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }


    static async update(id, attributes) {
        const response = await axios.patch(`/api/v1/tasks/${id}`, attributes);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }
}
