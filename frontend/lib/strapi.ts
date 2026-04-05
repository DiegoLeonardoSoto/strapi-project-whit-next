import qs from "qs";

export const STRAPI_BASE_URL =
  process.env.STRAPI_BASE_URL || "http://localhost:1337";

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "section.hero-section": {
          populate: {
            heroImage: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
      },
    },
  },
};

export async function getHomePage() {
  "use cache";

  console.log("getStrapiData");

  const query = qs.stringify(QUERY_HOME_PAGE);
  const resp = await getStrapiData(`/api/home-page?${query}`);
  return resp?.data;
}

export async function getStrapiData(url: string) {
  try {
    const resp = await fetch(`${STRAPI_BASE_URL}${url}`);

    if (!resp.ok) {
      throw new Error(`Error fetching data: ${resp.statusText}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from Strapi:", error);
    return null;
  }
}

export async function registerUserService(userData: {
  username: string;
  email: string;
  password: string;
}) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUserService(userData: {
  email: string;
  password: string;
}) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error login user:", error);
    throw error;
  }
}
