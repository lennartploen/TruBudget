import { all, put, takeEvery, takeLatest, takeLeading, call, select, delay } from "redux-saga/effects";
import { saveAs } from "file-saver/FileSaver";
import Api from "./api.js";
import _isEmpty from "lodash/isEmpty";
import strings from "./localizeStrings";
import {
  CREATE_PROJECT,
  CREATE_PROJECT_SUCCESS,
  FETCH_ALL_PROJECTS_SUCCESS,
  FETCH_ALL_PROJECTS,
  EDIT_PROJECT,
  EDIT_PROJECT_SUCCESS,
  FETCH_PROJECT_PERMISSIONS,
  FETCH_PROJECT_PERMISSIONS_SUCCESS,
  GRANT_PERMISSION,
  GRANT_PERMISSION_SUCCESS,
  REVOKE_PERMISSION_SUCCESS,
  REVOKE_PERMISSION
} from "./pages/Overview/actions";

import { VALIDATE_DOCUMENT, VALIDATE_DOCUMENT_SUCCESS, CLEAR_DOCUMENTS } from "./pages/Documents/actions";
import {
  CREATE_SUBPROJECT,
  CREATE_SUBPROJECT_SUCCESS,
  FETCH_ALL_PROJECT_DETAILS_SUCCESS,
  FETCH_ALL_PROJECT_DETAILS,
  ASSIGN_PROJECT_SUCCESS,
  ASSIGN_PROJECT,
  SET_TOTAL_PROJECT_HISTORY_ITEM_COUNT,
  FETCH_NEXT_PROJECT_HISTORY_PAGE,
  FETCH_NEXT_PROJECT_HISTORY_PAGE_SUCCESS,
  EDIT_SUBPROJECT_SUCCESS,
  EDIT_SUBPROJECT,
  CLOSE_PROJECT,
  CLOSE_PROJECT_SUCCESS,
  REVOKE_SUBPROJECT_PERMISSION_SUCCESS,
  REVOKE_SUBPROJECT_PERMISSION,
  GRANT_SUBPROJECT_PERMISSION,
  GRANT_SUBPROJECT_PERMISSION_SUCCESS,
  FETCH_SUBPROJECT_PERMISSIONS,
  FETCH_SUBPROJECT_PERMISSIONS_SUCCESS,
  LIVE_UPDATE_PROJECT
} from "./pages/SubProjects/actions";
import {
  SHOW_SNACKBAR,
  SNACKBAR_MESSAGE,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
  MARK_NOTIFICATION_AS_READ,
  FETCH_ALL_NOTIFICATIONS,
  FETCH_ALL_NOTIFICATIONS_SUCCESS,
  MARK_MULTIPLE_NOTIFICATIONS_AS_READ_SUCCESS,
  MARK_MULTIPLE_NOTIFICATIONS_AS_READ,
  FETCH_NOTIFICATION_COUNT_SUCCESS,
  FETCH_NOTIFICATION_COUNT,
  LIVE_UPDATE_NOTIFICATIONS,
  LIVE_UPDATE_NOTIFICATIONS_SUCCESS,
  TIME_OUT_FLY_IN
} from "./pages/Notifications/actions";
import {
  CREATE_WORKFLOW,
  CREATE_WORKFLOW_SUCCESS,
  FETCH_ALL_SUBPROJECT_DETAILS,
  FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS,
  FETCH_WORKFLOWITEM_PERMISSIONS,
  FETCH_WORKFLOWITEM_PERMISSIONS_SUCCESS,
  GRANT_WORKFLOWITEM_PERMISSION_SUCCESS,
  GRANT_WORKFLOWITEM_PERMISSION,
  CLOSE_WORKFLOWITEM,
  CLOSE_WORKFLOWITEM_SUCCESS,
  ASSIGN_WORKFLOWITEM_SUCCESS,
  ASSIGN_WORKFLOWITEM,
  ASSIGN_SUBPROJECT_SUCCESS,
  ASSIGN_SUBPROJECT,
  SET_TOTAL_SUBPROJECT_HISTORY_ITEM_COUNT,
  FETCH_NEXT_SUBPROJECT_HISTORY_PAGE,
  FETCH_NEXT_SUBPROJECT_HISTORY_PAGE_SUCCESS,
  REVOKE_WORKFLOWITEM_PERMISSION_SUCCESS,
  REVOKE_WORKFLOWITEM_PERMISSION,
  EDIT_WORKFLOW_ITEM_SUCCESS,
  EDIT_WORKFLOW_ITEM,
  REORDER_WORKFLOW_ITEMS,
  REORDER_WORKFLOW_ITEMS_SUCCESS,
  CLOSE_SUBPROJECT,
  CLOSE_SUBPROJECT_SUCCESS,
  HIDE_WORKFLOW_DETAILS,
  LIVE_UPDATE_SUBPROJECT,
  SHOW_WORKFLOW_PREVIEW,
  STORE_WORKFLOWACTIONS,
  SUBMIT_BATCH_FOR_WORKFLOW,
  SUBMIT_BATCH_FOR_WORKFLOW_SUCCESS,
  SUBMIT_BATCH_FOR_WORKFLOW_FAILURE
} from "./pages/Workflows/actions";

import {
  SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT,
  FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE,
  FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS
} from "./pages/WorkflowitemDetails/actions";

import {
  LOGIN,
  LOGIN_SUCCESS,
  SHOW_LOGIN_ERROR,
  STORE_ENVIRONMENT,
  LOGOUT_SUCCESS,
  LOGOUT,
  FETCH_USER_SUCCESS,
  FETCH_USER,
  FETCH_ENVIRONMENT_SUCCESS,
  FETCH_ENVIRONMENT,
  STORE_ENVIRONMENT_SUCCESS
} from "./pages/Login/actions";

import { showLoadingIndicator, hideLoadingIndicator, cancelDebounce } from "./pages/Loading/actions.js";
import {
  CREATE_USER_SUCCESS,
  CREATE_USER,
  FETCH_GROUPS_SUCCESS,
  FETCH_GROUPS,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP,
  ADD_USER,
  ADD_USER_SUCCESS,
  REMOVE_USER_SUCCESS,
  REMOVE_USER,
  GRANT_ALL_USER_PERMISSIONS_SUCCESS,
  GRANT_ALL_USER_PERMISSIONS,
  GRANT_GLOBAL_PERMISSION,
  GRANT_GLOBAL_PERMISSION_SUCCESS,
  REVOKE_GLOBAL_PERMISSION,
  REVOKE_GLOBAL_PERMISSION_SUCCESS,
  LIST_GLOBAL_PERMISSIONS_SUCCESS,
  LIST_GLOBAL_PERMISSIONS
} from "./pages/Users/actions.js";
import {
  FETCH_NODES_SUCCESS,
  FETCH_NODES,
  APPROVE_ORGANIZATION,
  APPROVE_ORGANIZATION_SUCCESS,
  APPROVE_NEW_NODE_FOR_ORGANIZATION,
  APPROVE_NEW_NODE_FOR_ORGANIZATION_SUCCESS
} from "./pages/Nodes/actions.js";
import {
  FETCH_ACTIVE_PEERS,
  FETCH_ACTIVE_PEERS_SUCCESS,
  FETCH_VERSIONS,
  FETCH_VERSIONS_SUCCESS,
  CREATE_BACKUP_SUCCESS,
  CREATE_BACKUP,
  RESTORE_BACKUP_SUCCESS,
  RESTORE_BACKUP,
  EXPORT_DATA,
  EXPORT_DATA_SUCCESS,
  EXPORT_DATA_FAILED
} from "./pages/Navbar/actions.js";
import {
  GET_SUBPROJECT_KPIS,
  GET_SUBPROJECT_KPIS_SUCCESS,
  GET_PROJECT_KPIS,
  GET_PROJECT_KPIS_SUCCESS,
  GET_EXCHANGE_RATES,
  GET_EXCHANGE_RATES_SUCCESS,
  GET_SUBPROJECT_KPIS_FAIL,
  GET_PROJECT_KPIS_FAIL
} from "./pages/Analytics/actions.js";
import { fromAmountString } from "./helper.js";
import { getExchangeRates } from "./getExchangeRates";

const api = new Api();

// SELECTORS
const getSelfId = state => {
  return state.getIn(["login", "id"]);
};
const getJwt = state => state.toJS().login.jwt;
const getEnvironment = state => {
  const env = state.getIn(["login", "environment"]);
  if (env) {
    return env;
  }
  return "Test";
};
const getProjectHistoryState = state => {
  return {
    currentHistoryPage: state.getIn(["detailview", "currentHistoryPage"]),
    historyPageSize: state.getIn(["detailview", "historyPageSize"]),
    totalHistoryItemCount: state.getIn(["detailview", "totalHistoryItemCount"])
  };
};
const getSubprojectHistoryState = state => {
  return {
    currentHistoryPage: state.getIn(["workflow", "currentHistoryPage"]),
    historyPageSize: state.getIn(["workflow", "historyPageSize"]),
    totalHistoryItemCount: state.getIn(["workflow", "totalHistoryItemCount"])
  };
};
const getWorkflowitemHistoryState = state => {
  return {
    currentHistoryPage: state.getIn(["workflowitemDetails", "currentHistoryPage"]),
    historyPageSize: state.getIn(["workflowitemDetails", "historyPageSize"]),
    totalHistoryItemCount: state.getIn(["workflowitemDetails", "totalHistoryItemCount"])
  };
};

function* execute(fn, showLoading = false, errorCallback = undefined) {
  const done = yield handleLoading(showLoading);
  try {
    yield fn();
  } catch (error) {
    if (typeof errorCallback === "function") {
      yield errorCallback(error);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
      yield handleError(error);
    }
  } finally {
    yield done();
  }
}

function* showSnackbarSuccess() {
  yield put({
    type: SHOW_SNACKBAR,
    show: true,
    isError: false
  });
}

function* handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API-Error: ", error.response || "No response from API");

  if (error.response && (error.response.status === 401 || error.response.status === 400)) {
    // which status should we use?
    yield call(logoutSaga);
  } else if (error.response && error.response.data) {
    yield put({
      type: SNACKBAR_MESSAGE,
      message: error.response.data.error.message
    });
    yield put({
      type: SHOW_SNACKBAR,
      show: true,
      isError: true
    });
  } else {
    yield put({
      type: SNACKBAR_MESSAGE,
      message: strings.common.disconnected
    });
    yield put({
      type: SHOW_SNACKBAR,
      show: true,
      isError: true
    });
  }
}

const getNotificationState = state => {
  return {
    currentNotificationPage: state.getIn(["notifications", "currentNotificationPage"]),
    numberOfNotificationPages: state.getIn(["notifications", "numberOfNotificationPages"]),
    notificationPageSize: state.getIn(["notifications", "notificationPageSize"])
  };
};

function* callApi(func, ...args) {
  const token = yield select(getJwt);
  yield call(api.setAuthorizationHeader, token);
  const env = yield select(getEnvironment);
  // TODO dont set the environment on each call
  const prefix = env === "Test" ? "/test" : "/prod";
  yield call(api.setBaseUrl, prefix);
  const { data } = yield call(func, ...args);
  return data;
}

let loadingCounter = 0;

function* handleLoading(showLoading) {
  if (showLoading) {
    loadingCounter++;
    yield put(showLoadingIndicator());
    return function* done() {
      loadingCounter--;
      if (!loadingCounter) {
        yield put(cancelDebounce());
        yield put(hideLoadingIndicator());
      }
    };
  } else {
    return function*() {};
  }
}

function* getBatchFromSubprojectTemplate(projectId, subprojectId, resources, selectedAssignee, permissions) {
  if (_isEmpty(selectedAssignee) && _isEmpty(permissions)) {
    return;
  }
  const possible = [];
  const notPossible = [];
  let action = {};
  const assignAction = strings.common.assign;
  const grantAction = strings.common.grant;
  const revokeAction = strings.common.revoke;
  const self = yield select(getSelfId);

  for (const r of resources) {
    // add assign action first
    if (selectedAssignee !== "") {
      action = {
        action: assignAction,
        id: r.data.id,
        displayName: r.data.displayName,
        assignee: selectedAssignee
      };
      if (r.data.status === "closed") {
        notPossible.push(action);
      } else {
        possible.push(action);
      }
    }
    // add grant permission actions next
    // TODO: add subprojectId
    const { data } = yield callApi(api.listWorkflowItemPermissions, projectId, subprojectId, r.data.id);
    const permissionsForResource = data;
    for (const intent in permissions) {
      if (_isEmpty(permissions[intent])) {
        continue;
      }
      const notRevokedIdentities = [];
      let revokeIdentities = [];
      for (const index in permissions[intent]) {
        const identity = permissions[intent][index];
        action = {
          action: grantAction,
          id: r.data.id,
          displayName: r.data.displayName,
          intent,
          identity
        };
        possible.push(action);
        notRevokedIdentities.push(identity);
      }
      // add revoke permission actions last
      revokeIdentities = permissionsForResource[intent].filter(i => !notRevokedIdentities.includes(i) && i !== self);
      for (const revokeIdentity in revokeIdentities) {
        action = {
          action: revokeAction,
          id: r.data.id,
          displayName: r.data.displayName,
          intent,
          identity: revokeIdentities[revokeIdentity]
        };
        possible.push(action);
      }
    }
  }

  return {
    possible,
    notPossible
  };
}

// SAGAS

export function* fetchVersionsSaga() {
  yield execute(function*() {
    const { data } = yield callApi(api.fetchVersions);
    data["frontend"] = { release: process.env.REACT_APP_VERSION };
    yield put({
      type: FETCH_VERSIONS_SUCCESS,
      versions: data
    });
  });
}

export function* createProjectSaga(action) {
  yield execute(function*() {
    yield callApi(api.createProject, action.name, action.comment, action.thumbnail, action.projectedBudgets);
    yield showSnackbarSuccess();
    yield put({
      type: CREATE_PROJECT_SUCCESS
    });
    yield put({
      type: FETCH_ALL_PROJECTS,
      showLoading: true
    });
  }, true);
}

export function* editProjectSaga({ projectId, changes, deletedProjectedBudgets = [] }) {
  yield execute(function*() {
    // TODO: Change call format
    // const { deletedProjectedBudgets = [], projectedBudgets = [], ...rest } = changes;
    const { projectedBudgets = [], ...rest } = changes;

    if (Object.values(rest).some(value => value !== undefined)) {
      yield callApi(api.editProject, projectId, rest);
    }

    for (const budget of projectedBudgets) {
      yield callApi(
        api.updateProjectBudgetProjected,
        projectId,
        budget.organization,
        budget.currencyCode,
        budget.value
      );
    }
    for (const budget of deletedProjectedBudgets) {
      yield callApi(api.deleteProjectBudgetProjected, projectId, budget.organization, budget.currencyCode);
    }
    yield showSnackbarSuccess();
    yield put({
      type: EDIT_PROJECT_SUCCESS
    });
    yield put({
      type: FETCH_ALL_PROJECTS,
      showLoading: true
    });
  }, true);
}

export function* createSubProjectSaga({ projectId, name, description, currency, projectedBudgets, showLoading }) {
  yield execute(function*() {
    yield callApi(api.createSubProject, projectId, name, description, currency, projectedBudgets);
    yield showSnackbarSuccess();
    yield put({
      type: CREATE_SUBPROJECT_SUCCESS
    });
    yield put({
      type: FETCH_ALL_PROJECT_DETAILS,
      projectId,
      showLoading
    });
  }, showLoading);
}

export function* editSubProjectSaga({ projectId, subprojectId, changes, deletedProjectedBudgets = [] }) {
  yield execute(function*() {
    const { projectedBudgets = [], ...rest } = changes;

    if (Object.values(rest).some(value => value !== undefined)) {
      yield callApi(api.editSubProject, projectId, subprojectId, rest);
    }

    for (const budget of projectedBudgets) {
      yield callApi(
        api.updateSubprojectBudgetProjected,
        projectId,
        subprojectId,
        budget.organization,
        budget.currencyCode,
        budget.value
      );
    }

    for (const budget of deletedProjectedBudgets) {
      yield callApi(
        api.deleteSubprojectBudgetProjected,
        projectId,
        subprojectId,
        budget.organization,
        budget.currencyCode
      );
    }

    yield showSnackbarSuccess();
    yield put({
      type: EDIT_SUBPROJECT_SUCCESS
    });
    yield put({
      type: FETCH_ALL_PROJECT_DETAILS,
      projectId,
      showLoading: true
    });
  }, true);
}

export function* createWorkflowItemSaga({ type, ...rest }) {
  yield execute(function*() {
    yield callApi(api.createWorkflowItem, rest);
    yield showSnackbarSuccess();
    yield put({
      type: CREATE_WORKFLOW_SUCCESS
    });

    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId: rest.projectId,
      subprojectId: rest.subprojectId,
      showLoading: true
    });
  });
}

export function* editWorkflowItemSaga({ projectId, subprojectId, workflowitemId, changes }) {
  yield execute(function*() {
    yield callApi(api.editWorkflowItem, projectId, subprojectId, workflowitemId, changes);
    yield showSnackbarSuccess();
    yield put({
      type: EDIT_WORKFLOW_ITEM_SUCCESS
    });

    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId: projectId,
      subprojectId: subprojectId,
      showLoading: true
    });
  });
}

export function* reorderWorkflowitemsSaga({ projectId, subprojectId, ordering }) {
  yield execute(function*() {
    yield callApi(api.reorderWorkflowitems, projectId, subprojectId, ordering);
    yield put({
      type: REORDER_WORKFLOW_ITEMS_SUCCESS
    });
  }, true);
}

export function* validateDocumentSaga({ base64String, hash }) {
  yield execute(function*() {
    const { data } = yield callApi(api.validateDocument, base64String, hash);
    yield put({
      type: VALIDATE_DOCUMENT_SUCCESS,
      isIdentical: data.isIdentical
    });
  }, true);
}

export function* setEnvironmentSaga(action) {
  yield execute(function*() {
    yield put({
      type: STORE_ENVIRONMENT_SUCCESS,
      environment: action.environment,
      productionActive: action.productionActive
    });
    yield put({
      type: FETCH_ENVIRONMENT
    });
  });
}

export function* getEnvironmentSaga() {
  yield execute(function*() {
    const env = yield select(getEnvironment);
    yield put({
      type: FETCH_ENVIRONMENT_SUCCESS,
      environment: env,
      productionActive: env === "Test" ? false : true
    });
  });
}

export function* fetchNotificationsSaga({ showLoading, notificationPage }) {
  yield execute(function*() {
    const { data: notificationCountData } = yield callApi(api.fetchNotificationCounts);
    const { notificationPageSize } = yield select(getNotificationState);

    const totalNotificationCount = notificationCountData.total;

    const numberOfNotificationPages =
      notificationPageSize !== 0 ? Math.ceil(totalNotificationCount / notificationPageSize) : 1;

    const isLastNotificationPage = notificationPage + 1 === numberOfNotificationPages;
    const offset = 0 - (notificationPage + 1) * notificationPageSize;
    const itemsToFetch = isLastNotificationPage
      ? totalNotificationCount - notificationPage * notificationPageSize
      : notificationPageSize;
    const { data } = yield callApi(api.fetchNotifications, offset, itemsToFetch);
    yield put({
      type: FETCH_ALL_NOTIFICATIONS_SUCCESS,
      notifications: data.notifications,
      currentNotificationPage: notificationPage,
      totalNotificationCount: totalNotificationCount
    });
  }, showLoading);
}

export function* fetchNotificationCountsSaga({ showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.fetchNotificationCounts);
    yield put({
      type: FETCH_NOTIFICATION_COUNT_SUCCESS,
      unreadNotificationCount: data.unread,
      notificationCount: data.total
    });
  }, showLoading);
}

export function* markNotificationAsReadSaga({ notificationId, notificationPage }) {
  yield execute(function*() {
    yield callApi(api.markNotificationAsRead, notificationId);
    yield put({
      type: MARK_NOTIFICATION_AS_READ_SUCCESS
    });
    yield put({
      type: FETCH_ALL_NOTIFICATIONS,
      showLoading: true,
      notificationPage
    });
    yield put({
      type: FETCH_NOTIFICATION_COUNT
    });
  }, true);
}

export function* markMultipleNotificationsAsReadSaga({ notificationIds, notificationPage }) {
  yield execute(function*() {
    yield callApi(api.markMultipleNotificationsAsRead, notificationIds);
    yield put({
      type: MARK_MULTIPLE_NOTIFICATIONS_AS_READ_SUCCESS
    });
    yield put({
      type: FETCH_ALL_NOTIFICATIONS,
      showLoading: true,
      notificationPage
    });
    yield put({
      type: FETCH_NOTIFICATION_COUNT
    });
  }, true);
}

export function* loginSaga({ user }) {
  function* login() {
    const { data } = yield callApi(api.login, user.username, user.password);

    yield put({
      type: LOGIN_SUCCESS,
      ...data
    });
    yield put({
      type: SHOW_LOGIN_ERROR,
      show: false
    });
  }
  function* onLoginError(error) {
    yield put({
      type: SHOW_LOGIN_ERROR,
      show: true
    });
    yield handleError(error);
  }
  yield execute(login, true, onLoginError);
}

export function* createUserSaga({ displayName, organization, username, password }) {
  yield execute(function*() {
    yield callApi(api.createUser, displayName, organization, username, password);
    yield put({
      type: CREATE_USER_SUCCESS
    });
    yield put({
      type: FETCH_USER,
      show: true
    });
  }, true);
}

export function* grantAllUserPermissionsSaga({ userId }) {
  yield execute(function*() {
    yield callApi(api.grantAllUserPermissions, userId);
    yield put({
      type: GRANT_ALL_USER_PERMISSIONS_SUCCESS
    });
  }, false);
}

export function* grantGlobalPermissionSaga({ identity, intent }) {
  yield execute(function*() {
    yield callApi(api.grantGlobalPermission, identity, intent);
    yield put({
      type: GRANT_GLOBAL_PERMISSION_SUCCESS
    });
    yield put({
      type: LIST_GLOBAL_PERMISSIONS
    });
  }, true);
}

export function* revokeGlobalPermissionSaga({ identity, intent }) {
  yield execute(function*() {
    yield callApi(api.revokeGlobalPermission, identity, intent);
    yield put({
      type: REVOKE_GLOBAL_PERMISSION_SUCCESS
    });
    yield put({
      type: LIST_GLOBAL_PERMISSIONS
    });
  }, true);
}

export function* listGlobalPermissionSaga() {
  yield execute(function*() {
    const { data } = yield callApi(api.listGlobalPermissions);
    yield put({
      type: LIST_GLOBAL_PERMISSIONS_SUCCESS,
      data
    });
  }, true);
}

export function* fetchUserSaga({ showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listUser);
    yield put({
      type: FETCH_USER_SUCCESS,
      user: data.items
    });
  }, showLoading);
}

export function* fetchGroupSaga({ showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listGroup);
    yield put({
      type: FETCH_GROUPS_SUCCESS,
      groups: data.groups
    });
  }, showLoading);
}

export function* createGroupSaga({ groupId, name, users }) {
  yield execute(function*() {
    yield callApi(api.createGroup, groupId, name, users);
    yield put({
      type: CREATE_GROUP_SUCCESS
    });
    yield put({
      type: FETCH_GROUPS,
      show: true
    });
  }, true);
}

export function* addUserToGroupSaga({ groupId, userId }) {
  yield execute(function*() {
    yield callApi(api.addUserToGroup, groupId, userId);
    yield put({
      type: ADD_USER_SUCCESS
    });
    yield put({
      type: FETCH_GROUPS,
      show: true
    });
  }, true);
}

export function* removeUserFromGroupSaga({ groupId, userId }) {
  yield execute(function*() {
    yield callApi(api.removeUserFromGroup, groupId, userId);
    yield put({
      type: REMOVE_USER_SUCCESS
    });
    yield put({
      type: FETCH_GROUPS,
      show: true
    });
  }, true);
}

export function* fetchNodesSaga({ showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listNodes);
    yield put({
      type: FETCH_NODES_SUCCESS,
      nodes: data.nodes
    });
  }, showLoading);
}

export function* approveNewOrganizationSaga({ organization, showLoading }) {
  yield execute(function*() {
    yield callApi(api.approveNewOrganization, organization);
    yield put({
      type: APPROVE_ORGANIZATION_SUCCESS
    });
    yield put({
      type: FETCH_NODES,
      show: true
    });
  }, showLoading);
}

export function* approveNewNodeForOrganizationSaga({ address, showLoading }) {
  yield execute(function*() {
    yield callApi(api.approveNewNodeForOrganization, address);
    yield put({
      type: APPROVE_NEW_NODE_FOR_ORGANIZATION_SUCCESS
    });
    yield put({
      type: FETCH_NODES,
      show: true
    });
  }, showLoading);
}

export function* logoutSaga() {
  yield execute(function*() {
    yield put({
      type: LOGOUT_SUCCESS
    });
  });
}

export function* fetchAllProjectsSaga({ showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listProjects);

    yield put({
      type: FETCH_ALL_PROJECTS_SUCCESS,
      projects: data.items
    });
  }, showLoading);
}

export function* fetchAllProjectDetailsSaga({ projectId, showLoading }) {
  yield execute(function*() {
    const projectDetails = yield callApi(api.viewProjectDetails, projectId);
    yield put({
      type: FETCH_ALL_PROJECT_DETAILS_SUCCESS,
      ...projectDetails.data
    });
  }, showLoading);
}

export function* fetchNextProjectHistoryPageSaga({ projectId, showLoading }) {
  yield execute(function*() {
    const { currentHistoryPage, historyPageSize, totalHistoryItemCount } = yield select(getProjectHistoryState);

    let offset = 0;
    if (totalHistoryItemCount === 0) {
      // Before the first call, we don't know how many history items there are
      // so we fetch a fixed number of the latest items
      offset = -historyPageSize;
    } else {
      // After the first call we just fetch each page
      // If the offset is below 0, we have reached the last page
      // and can fetch the first events
      offset = Math.max(0, totalHistoryItemCount - (currentHistoryPage + 1) * historyPageSize);
    }

    // If the offset is 0, we are on the last page and only need to fetch the remaining items
    const isLastPage = offset === 0;
    const remainingItems = totalHistoryItemCount - currentHistoryPage * historyPageSize;
    // If the remaining items are 0, it means that the total number of history items
    // is a multiple of the page size and we need to fetch a whole page
    const limit = isLastPage && remainingItems !== 0 ? remainingItems : historyPageSize;

    const { historyItemsCount, events } = yield callApi(api.viewProjectHistory, projectId, offset, limit);
    const lastHistoryPage = historyPageSize !== 0 ? Math.ceil(historyItemsCount / historyPageSize) : 1;
    const isFirstPage = totalHistoryItemCount === 0 && historyItemsCount !== 0;
    if (isFirstPage) {
      yield put({
        type: SET_TOTAL_PROJECT_HISTORY_ITEM_COUNT,
        totalHistoryItemsCount: historyItemsCount,
        lastHistoryPage
      });
    }

    yield put({
      type: FETCH_NEXT_PROJECT_HISTORY_PAGE_SUCCESS,
      events,
      currentHistoryPage: currentHistoryPage + 1
    });
  }, showLoading);
}

export function* fetchNextSubprojectHistoryPageSaga({ projectId, subprojectId, showLoading }) {
  yield execute(function*() {
    const { currentHistoryPage, historyPageSize, totalHistoryItemCount } = yield select(getSubprojectHistoryState);

    let offset = 0;
    if (totalHistoryItemCount === 0) {
      // Before the first call, we don't know how many history items there are
      // so we fetch a fixed number of the latest items
      offset = -historyPageSize;
    } else {
      // After the first call we just fetch each page
      // If the offset is below 0, we have reached the last page
      // and can fetch the first events
      offset = Math.max(0, totalHistoryItemCount - (currentHistoryPage + 1) * historyPageSize);
    }

    // If the offset is 0, we are on the last page and only need to fetch the remaining items
    const isLastPage = offset === 0;
    const remainingItems = totalHistoryItemCount - currentHistoryPage * historyPageSize;
    // If the remaining items are 0, it means that the total number of history items
    // is a multiple of the page size and we need to fetch a whole page
    const limit = isLastPage && remainingItems !== 0 ? remainingItems : historyPageSize;

    const { historyItemsCount, events } = yield callApi(
      api.viewSubProjectHistory,
      projectId,
      subprojectId,
      offset,
      limit
    );
    const lastHistoryPage = historyPageSize !== 0 ? Math.ceil(historyItemsCount / historyPageSize) : 1;
    const isFirstPage = totalHistoryItemCount === 0 && historyItemsCount !== 0;
    if (isFirstPage) {
      yield put({
        type: SET_TOTAL_SUBPROJECT_HISTORY_ITEM_COUNT,
        totalHistoryItemsCount: historyItemsCount,
        lastHistoryPage
      });
    }

    yield put({
      type: FETCH_NEXT_SUBPROJECT_HISTORY_PAGE_SUCCESS,
      events,
      currentHistoryPage: currentHistoryPage + 1
    });
  }, showLoading);
}

export function* fetchNextWorkflowitemHistoryPageSaga({ projectId, subprojectId, workflowitemId, showLoading }) {
  yield execute(function*() {
    const { currentHistoryPage, historyPageSize, totalHistoryItemCount } = yield select(getWorkflowitemHistoryState);

    let offset = 0;
    if (totalHistoryItemCount === 0) {
      // Before the first call, we don't know how many history items there are
      // so we fetch a fixed number of the latest items
      offset = -historyPageSize;
    } else {
      // After the first call we just fetch each page
      // If the offset is below 0, we have reached the last page
      // and can fetch the first events
      offset = Math.max(0, totalHistoryItemCount - (currentHistoryPage + 1) * historyPageSize);
    }

    // If the offset is 0, we are on the last page and only need to fetch the remaining items
    const isLastPage = offset === 0;
    const remainingItems = totalHistoryItemCount - currentHistoryPage * historyPageSize;
    // If the remaining items are 0, it means that the total number of history items
    // is a multiple of the page size and we need to fetch a whole page
    const limit = isLastPage && remainingItems !== 0 ? remainingItems : historyPageSize;

    const { historyItemsCount, events } = yield callApi(
      api.viewWorkflowitemHistory,
      projectId,
      subprojectId,
      workflowitemId,
      offset,
      limit
    );
    const lastHistoryPage = historyPageSize !== 0 ? Math.ceil(historyItemsCount / historyPageSize) : 1;
    const isFirstPage = totalHistoryItemCount === 0 && historyItemsCount !== 0;
    if (isFirstPage) {
      yield put({
        type: SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT,
        totalHistoryItemsCount: historyItemsCount,
        lastHistoryPage
      });
    }

    yield put({
      type: FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS,
      events,
      currentHistoryPage: currentHistoryPage + 1
    });
  }, showLoading);
}

export function* fetchAllSubprojectDetailsSaga({ projectId, subprojectId, showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.viewSubProjectDetails, projectId, subprojectId);
    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS,
      ...data
    });
  }, showLoading);
}

export function* fetchProjectPermissionsSaga({ projectId, showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listProjectIntents, projectId);

    yield put({
      type: FETCH_PROJECT_PERMISSIONS_SUCCESS,
      permissions: data || {}
    });
  }, showLoading);
}

export function* fetchSubProjectPermissionsSaga({ projectId, subprojectId, showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listSubProjectPermissions, projectId, subprojectId);

    yield put({
      type: FETCH_SUBPROJECT_PERMISSIONS_SUCCESS,
      permissions: data || {}
    });
  }, showLoading);
}

export function* fetchWorkflowItemPermissionsSaga({ projectId, subprojectId, workflowitemId, showLoading }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listWorkflowItemPermissions, projectId, subprojectId, workflowitemId);
    yield put({
      type: FETCH_WORKFLOWITEM_PERMISSIONS_SUCCESS,
      permissions: data || {}
    });
  }, showLoading);
}

export function* grantPermissionsSaga({ projectId, intent, identity, showLoading }) {
  yield execute(function*() {
    yield callApi(api.grantProjectPermissions, projectId, intent, identity);

    yield put({
      type: GRANT_PERMISSION_SUCCESS
    });

    yield put({
      type: FETCH_PROJECT_PERMISSIONS,
      projectId
    });
  }, showLoading);
}

export function* revokePermissionsSaga({ projectId, intent, identity, showLoading }) {
  yield execute(function*() {
    yield callApi(api.revokeProjectPermissions, projectId, intent, identity);

    yield put({
      type: REVOKE_PERMISSION_SUCCESS
    });

    yield put({
      type: FETCH_PROJECT_PERMISSIONS,
      projectId
    });
  }, showLoading);
}

export function* grantSubProjectPermissionsSaga({ projectId, subprojectId, intent, identity, showLoading }) {
  yield execute(function*() {
    yield callApi(api.grantSubProjectPermissions, projectId, subprojectId, intent, identity);

    yield put({
      type: GRANT_SUBPROJECT_PERMISSION_SUCCESS
    });

    yield put({
      type: FETCH_SUBPROJECT_PERMISSIONS,
      projectId,
      subprojectId,
      showLoading: true
    });
  }, showLoading);
}

export function* revokeSubProjectPermissionsSaga({ projectId, subprojectId, intent, identity, showLoading }) {
  yield execute(function*() {
    yield callApi(api.revokeSubProjectPermissions, projectId, subprojectId, intent, identity);

    yield put({
      type: REVOKE_SUBPROJECT_PERMISSION_SUCCESS
    });

    yield put({
      type: FETCH_SUBPROJECT_PERMISSIONS,
      projectId,
      subprojectId,
      showLoading: true
    });
  }, showLoading);
}

export function* grantWorkflowItemPermissionsSaga({
  projectId,
  subprojectId,
  workflowitemId,
  intent,
  identity,
  showLoading
}) {
  yield execute(function*() {
    yield callApi(api.grantWorkflowItemPermissions, projectId, subprojectId, workflowitemId, intent, identity);

    yield put({
      type: GRANT_WORKFLOWITEM_PERMISSION_SUCCESS,
      workflowitemId,
      intent,
      identity
    });

    yield put({
      type: FETCH_WORKFLOWITEM_PERMISSIONS,
      projectId,
      subprojectId,
      workflowitemId,
      showLoading: true
    });
  }, showLoading);
}

export function* revokeWorkflowItemPermissionsSaga({
  projectId,
  subprojectId,
  workflowitemId,
  intent,
  identity,
  showLoading
}) {
  yield execute(function*() {
    yield callApi(api.revokeWorkflowItemPermissions, projectId, subprojectId, workflowitemId, intent, identity);

    yield put({
      type: REVOKE_WORKFLOWITEM_PERMISSION_SUCCESS,
      workflowitemId,
      intent,
      identity
    });

    yield put({
      type: FETCH_WORKFLOWITEM_PERMISSIONS,
      projectId,
      subprojectId,
      workflowitemId,
      showLoading: true
    });
  }, showLoading);
}

export function* closeProjectSaga({ projectId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.closeProject, projectId);
    yield put({ type: CLOSE_PROJECT_SUCCESS });

    yield put({
      type: FETCH_ALL_PROJECT_DETAILS,
      projectId,
      showLoading
    });
  }, showLoading);
}

export function* closeSubprojectSaga({ projectId, subprojectId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.closeSubproject, projectId, subprojectId);
    yield put({ type: CLOSE_SUBPROJECT_SUCCESS });

    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId,
      subprojectId,
      showLoading
    });
  }, showLoading);
}

export function* closeWorkflowItemSaga({ projectId, subprojectId, workflowitemId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.closeWorkflowItem, projectId, subprojectId, workflowitemId);

    yield put({
      type: CLOSE_WORKFLOWITEM_SUCCESS
    });

    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId,
      subprojectId,
      showLoading
    });
  }, showLoading);
}

export function* fetchWorkflowActionsSaga({
  projectId,
  subprojectId,
  ressources,
  selectedAssignee,
  permissions,
  showLoading
}) {
  yield execute(function*() {
    const actions = yield getBatchFromSubprojectTemplate(
      projectId,
      subprojectId,
      ressources,
      selectedAssignee,
      permissions
    );
    yield put({
      type: STORE_WORKFLOWACTIONS,
      actions
    });
  }, showLoading);
}

export function* submitBatchForWorkflowSaga({ projectId, subprojectId, actions, showLoading }) {
  yield execute(function*() {
    for (const index in actions) {
      const action = actions[index];
      try {
        switch (action.action) {
          case strings.common.assign:
            yield callApi(api.assignWorkflowItem, projectId, subprojectId, action.id, action.assignee);
            yield put({
              type: ASSIGN_WORKFLOWITEM_SUCCESS,
              workflowitemId: action.id,
              assignee: action.assignee
            });
            break;

          case strings.common.grant:
            yield callApi(
              api.grantWorkflowItemPermissions,
              projectId,
              subprojectId,
              action.id,
              action.intent,
              action.identity
            );
            yield put({
              type: GRANT_WORKFLOWITEM_PERMISSION_SUCCESS,
              workflowitemId: action.id,
              intent: action.intent,
              identity: action.identity
            });
            break;

          case strings.common.revoke:
            yield callApi(
              api.revokeWorkflowItemPermissions,
              projectId,
              subprojectId,
              action.id,
              action.intent,
              action.identity
            );
            yield put({
              type: REVOKE_WORKFLOWITEM_PERMISSION_SUCCESS,
              workflowitemId: action.id,
              intent: action.intent,
              identity: action.identity
            });
            break;

          default:
            break;
        }
      } catch (error) {
        yield put({
          type: SUBMIT_BATCH_FOR_WORKFLOW_FAILURE,
          workflowitemId: action.id,
          assignee: action.assignee,
          identity: action.identity,
          intent: action.intent
        });
        throw error;
      }
    }
    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId,
      subprojectId,
      showLoading: false
    });
    yield put({
      type: SUBMIT_BATCH_FOR_WORKFLOW_SUCCESS
    });
  }, showLoading);
}

export function* assignWorkflowItemSaga({ projectId, subprojectId, workflowitemId, assigneeId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.assignWorkflowItem, projectId, subprojectId, workflowitemId, assigneeId);
    yield put({
      type: ASSIGN_WORKFLOWITEM_SUCCESS,
      workflowitemId,
      assignee: assigneeId
    });
    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId,
      subprojectId,
      showLoading: true
    });
  }, showLoading);
}

export function* assignSubprojectSaga({ projectId, subprojectId, assigneeId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.assignSubproject, projectId, subprojectId, assigneeId);
    yield put({
      type: ASSIGN_SUBPROJECT_SUCCESS
    });

    yield put({
      type: FETCH_ALL_SUBPROJECT_DETAILS,
      projectId,
      subprojectId,
      showLoading: true
    });
  }, showLoading);
}

export function* assignProjectSaga({ projectId, assigneeId, showLoading }) {
  yield execute(function*() {
    yield callApi(api.assignProject, projectId, assigneeId);
    yield put({
      type: ASSIGN_PROJECT_SUCCESS
    });
    yield put({
      type: FETCH_ALL_PROJECT_DETAILS,
      projectId,
      showLoading: true
    });
  }, showLoading);
}

export function* fetchActivePeersSaga({ showLoading = false }) {
  yield execute(function*() {
    const { data } = yield callApi(api.listActiveNodes);
    yield put({
      type: FETCH_ACTIVE_PEERS_SUCCESS,
      activePeers: data.peers
    });
  }, showLoading);
}
export function* hideWorkflowDetailsSaga() {
  yield execute(function*() {
    yield put({
      type: CLEAR_DOCUMENTS
    });
  });
}

export function* createBackupSaga({ showLoading = true }) {
  yield execute(function*() {
    const data = yield callApi(api.createBackup);
    saveAs(data, "backup.gz");
    yield put({
      type: CREATE_BACKUP_SUCCESS
    });
  }, showLoading);
}

export function* restoreBackupSaga({ file, showLoading = true }) {
  yield execute(function*() {
    const env = yield select(getEnvironment);
    const token = yield select(getJwt);
    const prefix = env === "Test" ? "/test" : "/prod";
    yield call(api.restoreFromBackup, prefix, token, file);
    yield put({
      type: RESTORE_BACKUP_SUCCESS
    });
    yield put({
      type: LOGOUT
    });
  }, showLoading);
}

// LiveUpdate Sagas
export function* liveUpdateProjectSaga({ projectId }) {
  yield execute(function*() {
    yield fetchAllProjectDetailsSaga({ projectId, loading: false });
  }, false);
}

export function* liveUpdateSubProjectSaga({ projectId, subprojectId }) {
  yield execute(function*() {
    yield fetchAllSubprojectDetailsSaga({ projectId, subprojectId, loading: false });
  }, false);
}

export function* liveUpdateNotificationsSaga({ showLoading, offset }) {
  yield execute(function*() {
    const { data } = yield callApi(api.fetchNotifications, offset);
    yield put({
      type: LIVE_UPDATE_NOTIFICATIONS_SUCCESS,
      newNotifications: data.notifications
    });
    yield delay(5000);
    yield put({
      type: TIME_OUT_FLY_IN
    });
  }, showLoading);
}

export function* getProjectKPIsSaga({ projectId, showLoading = true }) {
  yield execute(function*() {
    const {
      data: {
        project: {
          data: { projectedBudgets }
        },
        subprojects
      }
    } = yield callApi(api.viewProjectDetails, projectId);

    try {
      const subprojectBudgets = (yield all(
        subprojects.map(subproject => callApi(api.viewSubProjectDetails, projectId, subproject.data.id))
      )).map(subprojectDetails => {
        const currency = subprojectDetails.data.subproject.data.currency;
        const projected = subprojectDetails.data.subproject.data.projectedBudgets;
        const workflowBudgets = subprojectDetails.data.workflowitems.reduce(
          (acc, next) => {
            if (!next.data.amountType) {
              const error = new Error("redacted");
              error.name = "redacted";
              throw error;
            }
            const { amountType, status, amount, exchangeRate } = next.data;
            if (amountType === "allocated" && status === "closed" && amount) {
              return {
                ...acc,
                allocated: acc.allocated + fromAmountString(amount) * (exchangeRate || 1)
              };
            }

            if (amountType === "disbursed" && status === "closed" && amount) {
              return {
                ...acc,
                disbursed: acc.disbursed + fromAmountString(amount) * (exchangeRate || 1)
              };
            }

            return acc;
          },
          {
            allocated: 0,
            disbursed: 0
          }
        );
        return {
          projected,
          currency,
          disbursed: workflowBudgets.disbursed,
          allocated: workflowBudgets.allocated
        };
      });
      const projectBudgets = subprojectBudgets.reduce(
        (acc, next) => {
          if (next.disbursed !== 0) {
            acc.disbursed.push({ budget: next.disbursed, currency: next.currency });
          }
          if (next.allocated !== 0) {
            acc.allocated.push({ budget: next.allocated, currency: next.currency });
          }
          if (next.projected.length !== 0) {
            acc.projectedOfSubprojects.push(next.projected);
          }
          return {
            disbursed: acc.disbursed,
            allocated: acc.allocated,
            projectedOfSubprojects: acc.projectedOfSubprojects
          };
        },
        { disbursed: [], allocated: [], projectedOfSubprojects: [] }
      );

      yield put({
        type: GET_EXCHANGE_RATES,
        baseCurrency: projectedBudgets[0] ? projectedBudgets[0].currencyCode : "EUR"
      });

      yield put({
        type: GET_PROJECT_KPIS_SUCCESS,
        assignedBudget: projectBudgets.allocated,
        disbursedBudget: projectBudgets.disbursed,
        projectedBudget: projectBudgets.projectedOfSubprojects,
        totalBudget: projectedBudgets,
        displayCurrency: projectedBudgets[0] ? projectedBudgets[0].currencyCode : "EUR"
      });
    } catch (error) {
      if (error.name === "redacted") {
        yield put({
          type: GET_PROJECT_KPIS_FAIL,
          reason: "redacted"
        });
      } else {
        throw error;
      }
    }
  }, showLoading);
}

export function* getSubProjectKPIs({ projectId, subProjectId, showLoading = true }) {
  yield execute(function*() {
    const {
      data: {
        workflowitems = [],
        subproject: {
          data: { projectedBudgets = [], currency = "EUR" }
        }
      }
    } = yield callApi(api.viewSubProjectDetails, projectId, subProjectId);
    yield put({
      type: GET_EXCHANGE_RATES,
      baseCurrency: currency
    });
    try {
      const workflowBudgets = workflowitems.reduce(
        (acc, next) => {
          if (!next.data.amountType) {
            const error = new Error("redacted");
            error.name = "redacted";
            throw error;
          }
          const { amountType, status, amount, exchangeRate } = next.data;
          if (amountType === "allocated" && status === "closed" && amount) {
            return {
              ...acc,
              assignedBudget: acc.assignedBudget + fromAmountString(amount) * exchangeRate
            };
          }

          if (amountType === "disbursed" && status === "closed" && amount) {
            return {
              ...acc,
              disbursedBudget: acc.disbursedBudget + fromAmountString(amount) * exchangeRate
            };
          }

          return acc;
        },
        { assignedBudget: 0, disbursedBudget: 0 }
      );

      const response = {
        subProjectCurrency: currency,
        projectedBudgets: projectedBudgets,
        assignedBudget: workflowBudgets.assignedBudget,
        disbursedBudget: workflowBudgets.disbursedBudget
      };
      yield put({
        type: GET_SUBPROJECT_KPIS_SUCCESS,
        ...response
      });
    } catch (error) {
      if (error.name === "redacted") {
        yield put({
          type: GET_SUBPROJECT_KPIS_FAIL,
          reason: "redacted"
        });
      } else {
        throw error;
      }
    }
  }, showLoading);
}

export function* getExchangeRatesSaga({ baseCurrency, showLoading = true }) {
  yield execute(function*() {
    const exchangeRates = yield getExchangeRates(baseCurrency);
    yield put({
      type: GET_EXCHANGE_RATES_SUCCESS,
      exchangeRates
    });
  }, showLoading);
}

function* exportDataSaga() {
  yield execute(
    function*() {
      const data = yield callApi(api.export);
      saveAs(data, "TruBudget_Export.xlsx");
      yield put({
        type: EXPORT_DATA_SUCCESS
      });
    },
    true,
    function*(error) {
      yield put({
        type: EXPORT_DATA_FAILED,
        error
      });
      yield put({
        type: SNACKBAR_MESSAGE,
        message: "Exporting data failed!"
      });
      yield put({
        type: SHOW_SNACKBAR,
        show: true,
        isError: true
      });
    }
  );
}

export default function* rootSaga() {
  try {
    yield all([
      // Global
      yield takeLatest(LOGIN, loginSaga),
      yield takeEvery(LOGOUT, logoutSaga),
      yield takeEvery(CREATE_USER, createUserSaga),
      yield takeEvery(GRANT_ALL_USER_PERMISSIONS, grantAllUserPermissionsSaga),
      yield takeEvery(FETCH_USER, fetchUserSaga),
      yield takeEvery(FETCH_GROUPS, fetchGroupSaga),
      yield takeEvery(CREATE_GROUP, createGroupSaga),
      yield takeEvery(ADD_USER, addUserToGroupSaga),
      yield takeEvery(REMOVE_USER, removeUserFromGroupSaga),
      yield takeEvery(FETCH_NODES, fetchNodesSaga),
      yield takeEvery(APPROVE_ORGANIZATION, approveNewOrganizationSaga),
      yield takeEvery(APPROVE_NEW_NODE_FOR_ORGANIZATION, approveNewNodeForOrganizationSaga),
      yield takeLatest(STORE_ENVIRONMENT, setEnvironmentSaga),
      yield takeLatest(FETCH_ENVIRONMENT, getEnvironmentSaga),
      yield takeLatest(GRANT_GLOBAL_PERMISSION, grantGlobalPermissionSaga),
      yield takeLatest(REVOKE_GLOBAL_PERMISSION, revokeGlobalPermissionSaga),
      yield takeLatest(LIST_GLOBAL_PERMISSIONS, listGlobalPermissionSaga),

      // LiveUpdates
      yield takeLeading(LIVE_UPDATE_PROJECT, liveUpdateProjectSaga),
      yield takeLeading(LIVE_UPDATE_SUBPROJECT, liveUpdateSubProjectSaga),
      yield takeLeading(LIVE_UPDATE_NOTIFICATIONS, liveUpdateNotificationsSaga),

      // Project
      yield takeEvery(FETCH_ALL_PROJECTS, fetchAllProjectsSaga),
      yield takeEvery(CREATE_PROJECT, createProjectSaga),
      yield takeEvery(EDIT_PROJECT, editProjectSaga),
      yield takeLatest(FETCH_PROJECT_PERMISSIONS, fetchProjectPermissionsSaga),
      yield takeEvery(GRANT_PERMISSION, grantPermissionsSaga),
      yield takeEvery(REVOKE_PERMISSION, revokePermissionsSaga),
      yield takeEvery(ASSIGN_PROJECT, assignProjectSaga),
      yield takeEvery(FETCH_NEXT_PROJECT_HISTORY_PAGE, fetchNextProjectHistoryPageSaga),
      yield takeEvery(CLOSE_PROJECT, closeProjectSaga),
      yield takeEvery(FETCH_ALL_PROJECT_DETAILS, fetchAllProjectDetailsSaga),

      // Subproject
      yield takeEvery(FETCH_ALL_SUBPROJECT_DETAILS, fetchAllSubprojectDetailsSaga),
      yield takeEvery(CREATE_SUBPROJECT, createSubProjectSaga),
      yield takeEvery(EDIT_SUBPROJECT, editSubProjectSaga),
      yield takeLatest(FETCH_SUBPROJECT_PERMISSIONS, fetchSubProjectPermissionsSaga),
      yield takeEvery(GRANT_SUBPROJECT_PERMISSION, grantSubProjectPermissionsSaga),
      yield takeEvery(FETCH_NEXT_SUBPROJECT_HISTORY_PAGE, fetchNextSubprojectHistoryPageSaga),
      yield takeEvery(REVOKE_SUBPROJECT_PERMISSION, revokeSubProjectPermissionsSaga),
      yield takeEvery(CLOSE_SUBPROJECT, closeSubprojectSaga),
      yield takeEvery(ASSIGN_SUBPROJECT, assignSubprojectSaga),

      // Workflow
      yield takeEvery(CREATE_WORKFLOW, createWorkflowItemSaga),
      yield takeEvery(EDIT_WORKFLOW_ITEM, editWorkflowItemSaga),
      yield takeEvery(REORDER_WORKFLOW_ITEMS, reorderWorkflowitemsSaga),
      yield takeLatest(FETCH_WORKFLOWITEM_PERMISSIONS, fetchWorkflowItemPermissionsSaga),
      yield takeEvery(GRANT_WORKFLOWITEM_PERMISSION, grantWorkflowItemPermissionsSaga),
      yield takeEvery(REVOKE_WORKFLOWITEM_PERMISSION, revokeWorkflowItemPermissionsSaga),
      yield takeEvery(CLOSE_WORKFLOWITEM, closeWorkflowItemSaga),
      yield takeEvery(ASSIGN_WORKFLOWITEM, assignWorkflowItemSaga),
      yield takeEvery(HIDE_WORKFLOW_DETAILS, hideWorkflowDetailsSaga),
      yield takeEvery(VALIDATE_DOCUMENT, validateDocumentSaga),
      yield takeEvery(SHOW_WORKFLOW_PREVIEW, fetchWorkflowActionsSaga),
      yield takeEvery(SUBMIT_BATCH_FOR_WORKFLOW, submitBatchForWorkflowSaga),
      yield takeEvery(FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE, fetchNextWorkflowitemHistoryPageSaga),

      // Notifications
      yield takeEvery(FETCH_ALL_NOTIFICATIONS, fetchNotificationsSaga),
      yield takeEvery(FETCH_NOTIFICATION_COUNT, fetchNotificationCountsSaga),
      yield takeEvery(MARK_NOTIFICATION_AS_READ, markNotificationAsReadSaga),
      yield takeEvery(MARK_MULTIPLE_NOTIFICATIONS_AS_READ, markMultipleNotificationsAsReadSaga),

      // Peers
      yield takeLatest(FETCH_ACTIVE_PEERS, fetchActivePeersSaga),

      // System
      yield takeLatest(CREATE_BACKUP, createBackupSaga),
      yield takeLatest(RESTORE_BACKUP, restoreBackupSaga),
      yield takeLatest(FETCH_VERSIONS, fetchVersionsSaga),

      // Analytics
      yield takeLeading(GET_SUBPROJECT_KPIS, getSubProjectKPIs),
      yield takeLeading(GET_PROJECT_KPIS, getProjectKPIsSaga),
      yield takeLeading(GET_EXCHANGE_RATES, getExchangeRatesSaga),
      yield takeLeading(EXPORT_DATA, exportDataSaga)
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    yield rootSaga();
  }
}
