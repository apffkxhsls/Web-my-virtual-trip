const diaryRecordsKey = "mvt_diary_library";
const diaryViewIdKey = "mvt_diary_view_id";
const diaryEditIdKey = "mvt_diary_edit_id";
const sampleCompanionsKey = "mvt_diary_sample_companions";
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

function loadDiaryRecords(showRecords, showError) {
    fetch("../data/12_웹벤져스_diary.json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (samples) {
            if (samples === null) {
                showSavedRecords();
                return;
            }
            const current = localStorage.getItem(diaryRecordsKey);
            let records = samples;
            if (current === null) {
                const previous = localStorage.getItem("mvt_diary_records");
                if (previous !== null) {
                    records = samples.concat(JSON.parse(previous));
                }
            } else {
                records = JSON.parse(current);
            }
            syncSampleDefaults(records, samples);
            showRecords(records);
        })
        .catch(showSavedRecords);

    function showSavedRecords() {
        const saved = localStorage.getItem(diaryRecordsKey);
        if (saved === null) {
            showError();
        } else {
            const records = JSON.parse(saved);
            updateDiaryImagePaths(records);
            showRecords(records);
        }
    }
}

function syncSampleDefaults(records, samples) {
    const savedDefaults = localStorage.getItem(sampleCompanionsKey);
    // The first release stored the sample records before tracking their JSON defaults.
    let previousDefaults = {1: "지수, 민호", 2: "가족", 3: "수빈", 4: "가족", 5: "현우, 예린"};
    if (savedDefaults !== null) {
        previousDefaults = JSON.parse(savedDefaults);
    }
    const previousCovers = previousDefaults.covers || {};
    const defaults = {covers: {}};
    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        defaults[sample.id] = sample.companions;
        defaults.covers[sample.id] = sample.coverImage;
        const index = findDiaryRecord(records, sample.id);
        if (index < 0) {
            continue;
        }
        const record = records[index];
        if (record.companions === previousDefaults[sample.id]) {
            record.companions = sample.companions;
        }
        const previousCover = previousCovers[sample.id] || oldDiaryImage;
        if (record.coverImage === previousCover && sample.coverImage !== previousCover) {
            record.coverImage = sample.coverImage;
            const photos = record.photos || [];
            record.photos = [sample.coverImage];
            for (let j = 0; j < photos.length; j++) {
                if (photos[j] !== previousCover && photos[j] !== sample.coverImage) {
                    record.photos.push(photos[j]);
                }
            }
        }
    }
    saveDiaryRecords(records);
    localStorage.setItem(sampleCompanionsKey, JSON.stringify(defaults));
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

function saveDiaryRecords(records) {
    updateDiaryImagePaths(records);
    localStorage.setItem(diaryRecordsKey, JSON.stringify(records));
}

function findDiaryRecord(records, id) {
    for (let i = 0; i < records.length; i++) {
        if (records[i].id === id) {
            return i;
        }
    }
    return -1;
}
