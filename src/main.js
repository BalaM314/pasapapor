import { addListeners } from "./ui.js";
const openedPapors = {
    lsKey: "pasapapor-openedpapers",
    storage: {},
    load() {
        const data = localStorage.getItem(this.lsKey);
        if (data) {
            function fail(message) {
                throw new Error(message);
            }
            try {
                const dataObj = JSON.parse(data);
                if (typeof dataObj != "object" || dataObj == null)
                    fail("invalid json");
                for (const [k, v] of Object.entries(dataObj)) {
                    if (!/(\d{4})_([msw]\d{2})_(\d{2})/.test(k))
                        fail(`invalid key ${k}`);
                    if (typeof v != "object" || v == null)
                        fail("invalid json");
                    if (!("status" in v && ["complete", "partial"].includes(v.status) && "dateUpdated" in v && typeof v.dateUpdated == "number"))
                        fail("bad data");
                    this.storage[k] = {
                        status: v.status,
                        dateUpdated: new Date(v.dateUpdated)
                    };
                }
            }
            catch (err) {
                console.error(err);
                localStorage.setItem(`${this.lsKey}-invalid-${Date.now()}`, data);
                localStorage.removeItem(this.lsKey);
            }
        }
    },
    save() {
        localStorage.setItem(this.lsKey, JSON.stringify(this.storage, (k, v) => {
            if (k == "dateUpdated" && v instanceof Date)
                return v.getTime();
            else
                return v;
        }));
    }
};
window.addEventListener("beforeunload", () => {
    openedPapors.save();
});
openedPapors.load();
addListeners();
console.log(`%c<Pasapapor>`, "font-weight: bold; font-size: 150%; color: yellowgreen");
console.log("%csource code available at https://github.com/BalaM314/pasapapor/", "font-size: 150%;");
