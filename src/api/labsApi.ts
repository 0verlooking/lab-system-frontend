import http from "./http";

export const fetchLabs = async () => {
    const res = await http.get("/labs");
    return res.data;
};

export const createLab = async (lab) => {
    const res = await http.post("/labs", lab);
    return res.data;
};

export const deleteLab = async (id) => {
    await http.delete(`/labs/${id}`);
};

export const updateLab = async (id, lab) => {
    const res = await http.put(`/labs/${id}`, lab);
    return res.data;
};
