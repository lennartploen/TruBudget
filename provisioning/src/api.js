const { withRetry } = require("./lib");

const authenticate = async (axios, userId, password) => {
  const response = await withRetry(() =>
    axios.post("/user.authenticate", {
      user: {
        id: userId,
        password
      }
    })
  );
  const body = response.data;
  if (body.apiVersion !== "1.0") throw Error("unexpected API version");
  return body.data.user.token;
};

const createUser = async (axios, user, organization) => {
  await withRetry(() =>
    axios.post("/global.createUser", {
      user: {
        ...user,
        organization
      }
    })
  );
};

const grantGlobalPermissionToUser = async (axios, intent, userId) => {
  return await withRetry(() =>
    axios.post("/global.grantPermission", {
      intent,
      identity: userId
    })
  );
};

const grantAllPermissionsToUser = async (axios, userId) => {
  return await withRetry(() =>
    axios.post("/global.grantAllPermissions", {
      identity: userId
    })
  );
};

const createProject = async (axios, projectTemplate) => {
  await withRetry(() =>
    axios.post("/global.createProject", {
      project: {
        displayName: projectTemplate.displayName,
        description: "FAILED UPDATE?",
        projectedBudgets: projectTemplate.projectedBudgets,
        thumbnail: projectTemplate.thumbnail
      }
    })
  );
};

const closeProject = async (axios, project) => {
  await withRetry(() =>
    axios.post("/project.close", {
      projectId: project.data.id
    })
  );
};

const createSubproject = async (axios, project, subprojectTemplate) => {
  await withRetry(() =>
    axios.post("/project.createSubproject", {
      projectId: project.data.id,
      subproject: {
        displayName: subprojectTemplate.displayName,
        description: "FAILED UPDATE?",
        status: "open", // otherwise we won't be able to add workflowitems
        currency: subprojectTemplate.currency,
        projectedBudgets: subprojectTemplate.projectedBudgets,
        assignee: subprojectTemplate.assignee
      }
    })
  );
};

const updateProject = async (axios, projectId, description) => {
  await withRetry(() =>
    axios.post("/project.update", {
      projectId: projectId,
      description: description || ""
    })
  );
};

const updateSubproject = async (
  axios,
  projectId,
  subprojectId,
  description
) => {
  await withRetry(() =>
    axios.post("/subproject.update", {
      projectId: projectId,
      subprojectId: subprojectId,
      description: description || ""
    })
  );
};
const closeSubproject = async (axios, projectId, subprojectId) => {
  await withRetry(() =>
    axios.post("/subproject.close", {
      projectId: projectId,
      subprojectId: subprojectId
    })
  );
};

const createWorkflowitem = async (axios, data) => {
  await withRetry(() => axios.post("/subproject.createWorkflowitem", data));
};

const updateWorkflowitem = async (
  axios,
  projectId,
  subprojectId,
  workflowitemId,
  description
) => {
  await withRetry(() =>
    axios.post("/workflowitem.update", {
      projectId: projectId,
      subprojectId: subprojectId,
      workflowitemId: workflowitemId,
      description: description || ""
    })
  );
};
const closeWorkflowitem = async (
  axios,
  projectId,
  subprojectId,
  workflowitemId
) => {
  await withRetry(() =>
    axios.post("/workflowitem.close", {
      projectId: projectId,
      subprojectId: subprojectId,
      workflowitemId: workflowitemId
    })
  );
};

const findProject = async (axios, projectTemplate) => {
  return await withRetry(() =>
    axios
      .get("/project.list")
      .then(res => res.data.data.items)
      .then(projects =>
        projects.find(p => p.data.displayName === projectTemplate.displayName)
      )
      .catch(err => {
        console.error(err);
        process.exit(1);
      })
  );
};

const findSubproject = async (axios, project, subprojectTemplate) => {
  return await withRetry(() =>
    axios
      .get(`/subproject.list?projectId=${project.data.id}`)
      .then(res => res.data.data.items)
      .then(subprojects =>
        subprojects.find(
          x => x.data.displayName === subprojectTemplate.displayName
        )
      )
  );
};

const findWorkflowitem = async (
  axios,
  project,
  subproject,
  workflowitemTemplate
) => {
  return await withRetry(() =>
    axios
      .get(
        `/workflowitem.list?projectId=${project.data.id}&subprojectId=${
          subproject.data.id
        }`
      )
      .then(res => res.data.data.workflowitems)
      .then(items =>
        items.find(
          item => item.data.displayName === workflowitemTemplate.displayName
        )
      )
  );
};
const grantPermissions = async (
  axios,
  permissions,
  projectId,
  subprojectId,
  workflowitemId
) => {
  if (permissions === undefined) return;

  let url;
  let body;
  if (workflowitemId !== undefined) {
    url = "/workflowitem.intent.grantPermission";
    body = {
      projectId,
      subprojectId,
      workflowitemId
    };
  } else if (subprojectId !== undefined) {
    url = "/subproject.intent.grantPermission";
    body = {
      projectId,
      subprojectId
    };
  } else if (projectId !== undefined) {
    url = "/project.intent.grantPermission";
    body = {
      projectId
    };
  } else {
    throw Error("not even projectId is given..");
  }

  for (const [intent, users] of Object.entries(permissions)) {
    for (const userId of users) {
      await withRetry(() =>
        axios.post(url, {
          ...body,
          intent,
          identity: userId
        })
      );
    }
  }
};

const revokeProjectPermission = async (axios, projectId, userId, intent) => {
  await withRetry(() =>
    axios.post("/project.intent.revokePermission", {
      projectId: projectId,
      identity: userId,
      intent: intent
    })
  );
};
const queryApiDoc = async axios => {
  return await withRetry(() => axios.get("/documentation"));
};

module.exports = {
  authenticate,
  createUser,
  grantGlobalPermissionToUser,
  grantAllPermissionsToUser,
  createProject,
  closeProject,
  createSubproject,
  updateProject,
  updateSubproject,
  closeSubproject,
  createWorkflowitem,
  updateWorkflowitem,
  closeWorkflowitem,
  findProject,
  findSubproject,
  findWorkflowitem,
  grantPermissions,
  revokeProjectPermission,
  queryApiDoc
};
