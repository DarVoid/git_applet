import axios from "axios";

async function query(url: string, query: string, token: string) {
    const res = await axios.post(url, { query }, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export {
    query,
};
