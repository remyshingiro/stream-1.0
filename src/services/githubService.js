// CONFIGURATION: Now loaded securely from .env file
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO;
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`;

// Helper: GitHub API requires Base64 encoding
const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
const fromBase64 = (str) => decodeURIComponent(escape(atob(str)));

// 1. FETCH ALL MOVIES & SERIES
export const fetchAllData = async () => {
  if (!TOKEN) {
    console.error("❌ Missing GitHub Token. Check your .env file.");
    return [];
  }

  try {
    const [moviesReq, seriesReq] = await Promise.all([
      fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/movies.json`),
      fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/series.json`)
    ]);

    const movies = moviesReq.ok ? await moviesReq.json() : [];
    const series = seriesReq.ok ? await seriesReq.json() : [];

    // Tag them so the app knows which is which
    const moviesWithType = movies.map(m => ({ ...m, type: 'movie' }));
    const seriesWithType = series.map(s => ({ ...s, type: 'series' }));

    return [...moviesWithType, ...seriesWithType];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// 2. SAVE NEW CONTENT
export const saveContent = async (newContentItem) => {
  if (!TOKEN) {
    alert("❌ Error: GitHub Token is missing in .env file");
    return false;
  }

  // Decide which file to update based on the type
  const isSeries = newContentItem.type === 'series' || newContentItem.category === 'Series';
  const fileName = isSeries ? "series.json" : "movies.json";
  const url = `${BASE_URL}/${fileName}`;

  try {
    // A. Get current file data (we need the 'sha' ID to update it)
    const getResponse = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    
    if (!getResponse.ok) throw new Error("Failed to fetch file info from GitHub");
    
    const fileData = await getResponse.json();
    
    // B. Decode existing list
    const currentContent = JSON.parse(fromBase64(fileData.content));
    
    // C. Add new item to the TOP of the list
    const updatedContent = [newContentItem, ...currentContent];

    // D. Upload the updated list
    const putResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add new ${isSeries ? 'Series' : 'Movie'}: ${newContentItem.title}`,
        content: toBase64(JSON.stringify(updatedContent, null, 2)),
        sha: fileData.sha 
      }),
    });

    if (!putResponse.ok) throw new Error("GitHub update failed");
    return true;

  } catch (error) {
    console.error("Save failed:", error);
    alert(`Error: ${error.message}`);
    return false;
  }
};