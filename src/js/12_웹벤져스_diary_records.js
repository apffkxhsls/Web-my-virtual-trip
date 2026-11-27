const diaryChangesKey = "mvt_diary_changes";
const diaryViewIdKey = "mvt_diary_view_id";
const diaryEditIdKey = "mvt_diary_edit_id";
const oldDiaryImage = "../res/images/12_diary_image.jpg";
const diaryFallbackImage = "../res/images/12_diary_image.webp";

function formatDiaryAmount(amount) {
    const digits = amount + "";
    let formatted = "";
    for (let i = 0; i < digits.length; i++) {
        if (i > 0 && (digits.length - i) % 3 === 0) {
            formatted += ",";
        }
        formatted += digits[i];
    }
    return formatted;
}

function diaryExpenseText(amount, unit) {
    if (amount === null || amount === undefined) {
        return "-";
    }
    return formatDiaryAmount(amount) + unit;
}

function diaryRecordExpense(record) {
    if (!record.expense && !record.expenseEntered) {
        return null;
    }
    return record.expense;
}

let diarySamples = [];

function readDiaryChanges() {
    const saved = localStorage.getItem(diaryChangesKey);
    if (saved === null) {
        return {records: [], edits: {}, deleted: {}};
    }
    return JSON.parse(saved);
}

function migrateDiaryChanges(samples) {
    const changes = readDiaryChanges();
    if (localStorage.getItem(diaryChangesKey) !== null) {
        return changes;
    }

    const library = localStorage.getItem("mvt_diary_library");
    const previous = localStorage.getItem("mvt_diary_records");
    if (library === null) {
        if (previous !== null) {
            changes.records = JSON.parse(previous);
        }
    } else {
        const records = JSON.parse(library);
        const savedDefaults = localStorage.getItem("mvt_diary_sample_companions");
        let defaults = {1: "지수, 민호", 2: "가족", 3: "수빈", 4: "가족", 5: "현우, 예린"};
        if (savedDefaults !== null) {
            defaults = JSON.parse(savedDefaults);
        }
        const covers = defaults.covers || {};
        updateDiaryImagePaths(records);
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const index = findDiaryRecord(samples, record.id);
            if (index < 0) {
                if (record.id < 1 || record.id > 5) {
                    changes.records.push(record);
                }
                continue;
            }

            const sample = samples[index];
            const oldCover = covers[record.id] || oldDiaryImage;
            const priorCover = oldCover === oldDiaryImage ? diaryFallbackImage : oldCover;
            // Earlier versions recorded default companions and covers separately.
            if (record.companions === defaults[record.id]) {
                record.companions = sample.companions;
            }
            if (record.coverImage === priorCover && priorCover !== sample.coverImage) {
                const photos = record.photos || [];
                record.photos = [sample.coverImage];
                for (let j = 0; j < photos.length; j++) {
                    if (photos[j] !== priorCover && photos[j] !== sample.coverImage) {
                        record.photos.push(photos[j]);
                    }
                }
                record.coverImage = sample.coverImage;
            }
            const edit = {};
            for (const field in record) {
                if (JSON.stringify(record[field]) !== JSON.stringify(sample[field])) {
                    edit[field] = record[field];
                }
            }
            if (JSON.stringify(edit) !== "{}") {
                changes.edits[record.id] = edit;
            }
        }

        for (let id = 1; id <= 5; id++) {
            if (findDiaryRecord(records, id) < 0) {
                changes.deleted[id] = true;
            }
        }
    }
    updateDiaryImagePaths(changes.records);
    saveDiaryChanges(changes);
    localStorage.removeItem("mvt_diary_library");
    localStorage.removeItem("mvt_diary_records");
    localStorage.removeItem("mvt_diary_sample_companions");
    return changes;
}

function saveDiaryChanges(changes) {
    localStorage.setItem(diaryChangesKey, JSON.stringify(changes));
}

function diaryRecordsFrom(changes) {
    const records = [];
    for (let i = 0; i < diarySamples.length; i++) {
        const sample = diarySamples[i];
        if (!changes.deleted[sample.id]) {
            const record = {};
            for (const field in sample) {
                record[field] = sample[field];
            }
            const edit = changes.edits[sample.id] || {};
            for (const field in edit) {
                record[field] = edit[field];
            }
            records.push(record);
        }
    }
    return records.concat(changes.records);
}

function loadDiaryRecords(showRecords, showError) {
    fetch("../data/12_웹벤져스_diary.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .catch(function () {
            return null;
        })
        .then(function (samples) {
            if (samples !== null) {
                diarySamples = samples;
                return diaryRecordsFrom(migrateDiaryChanges(samples));
            }
            if (localStorage.getItem(diaryChangesKey) !== null) {
                diarySamples = [];
                return readDiaryChanges().records;
            }
            return null;
        })
        .catch(function () {
            return null;
        })
        .then(function (records) {
            if (records === null) {
                showError();
            } else {
                showRecords(records);
            }
        });
}

function saveDiaryRecord(record, original) {
    const changes = readDiaryChanges();
    const records = diaryRecordsFrom(changes);
    if (!original) {
        record.id = new Date().getTime();
        for (let i = 0; i < records.length; i++) {
            if (records[i].id >= record.id) {
                record.id = records[i].id + 1;
            }
        }
        changes.records.push(record);
    } else {
        if (findDiaryRecord(records, record.id) < 0) {
            return false;
        }
        const index = findDiaryRecord(changes.records, record.id);
        if (index >= 0) {
            for (const field in record) {
                if (JSON.stringify(record[field]) !== JSON.stringify(original[field])) {
                    changes.records[index][field] = record[field];
                }
            }
        } else {
            const sample = diarySamples[findDiaryRecord(diarySamples, record.id)];
            const edit = changes.edits[record.id] || {};
            for (const field in record) {
                if (JSON.stringify(record[field]) !== JSON.stringify(original[field])) {
                    if (JSON.stringify(record[field]) === JSON.stringify(sample[field])) {
                        delete edit[field];
                    } else {
                        edit[field] = record[field];
                    }
                }
            }
            if (JSON.stringify(edit) === "{}") {
                delete changes.edits[record.id];
            } else {
                changes.edits[record.id] = edit;
            }
        }
    }
    saveDiaryChanges(changes);
    return true;
}

function deleteDiaryRecord(id) {
    const changes = readDiaryChanges();
    const index = findDiaryRecord(changes.records, id);
    if (index >= 0) {
        changes.records = changes.records.slice(0, index).concat(changes.records.slice(index + 1));
    } else if (findDiaryRecord(diarySamples, id) >= 0) {
        changes.deleted[id] = true;
        delete changes.edits[id];
    }
    saveDiaryChanges(changes);
}

function updateDiaryImagePaths(records) {
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        if (record.coverImage === oldDiaryImage) {
            record.coverImage = diaryFallbackImage;
        }
        const photos = record.photos || [];
        for (let j = 0; j < photos.length; j++) {
            if (photos[j] === oldDiaryImage) {
                photos[j] = diaryFallbackImage;
            }
        }
    }
}

function findDiaryRecord(records, id) {
    for (let i = 0; i < records.length; i++) {
        if (records[i].id === id) {
            return i;
        }
    }
    return -1;
}
