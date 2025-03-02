import * as GlobalPermissionGrantAPI from "./global_permission_grant";
import * as GlobalPermissionRevokeAPI from "./global_permission_revoke";
import * as GlobalPermissionsGrantAllAPI from "./global_permissions_grant_all";
import * as GlobalPermissionsListAPI from "./global_permissions_list";
import * as GroupCreateAPI from "./group_create";
import * as GroupListAPI from "./group_list";
import * as GroupMemberAddAPI from "./group_member_add";
import * as GroupMemberRemoveAPI from "./group_member_remove";
import { registerRoutes } from "./httpd/router";
import { createBasicApp } from "./httpd/server";
import deepcopy from "./lib/deepcopy";
import logger from "./lib/logger";
import { isReady } from "./lib/readiness";
import timeout from "./lib/timeout";
import { registerNode } from "./network/controller/registerNode";
import * as NotificationCountAPI from "./notification_count";
import * as NotificationListAPI from "./notification_list";
import * as NotificationMarkReadAPI from "./notification_mark_read";
import { ensureOrganizationStream } from "./organization/organization";
import * as ProjectAssignAPI from "./project_assign";
import * as ProjectProjectedBudgetDeleteAPI from "./project_budget_delete_projected";
import * as ProjectProjectedBudgetUpdateAPI from "./project_budget_update_projected";
import * as ProjectCloseAPI from "./project_close";
import * as ProjectCreateAPI from "./project_create";
import * as ProjectListAPI from "./project_list";
import * as ProjectPermissionGrantAPI from "./project_permission_grant";
import * as ProjectPermissionRevokeAPI from "./project_permission_revoke";
import * as ProjectPermissionsListAPI from "./project_permissions_list";
import * as ProjectUpdateAPI from "./project_update";
import * as ProjectViewDetailsAPI from "./project_view_details";
import * as ProjectViewHistoryAPI from "./project_view_history";
import * as ProjectViewHistoryAPIv2 from "./project_view_history_v2";
import * as Multichain from "./service";
import * as Cache from "./service/cache2";
import * as DocumentValidationService from "./service/document_validation";
import * as GlobalPermissionGrantService from "./service/global_permission_grant";
import * as GlobalPermissionRevokeService from "./service/global_permission_revoke";
import * as GlobalPermissionsGetService from "./service/global_permissions_get";
import * as GroupCreateService from "./service/group_create";
import * as GroupMemberAddService from "./service/group_member_add";
import * as GroupMemberRemoveService from "./service/group_member_remove";
import * as GroupQueryService from "./service/group_query";
import { randomString } from "./service/hash";
import * as NotificationListService from "./service/notification_list";
import * as NotificationMarkReadService from "./service/notification_mark_read";
import * as ProjectAssignService from "./service/project_assign";
import * as ProjectCloseService from "./service/project_close";
import * as ProjectCreateService from "./service/project_create";
import * as ProjectGetService from "./service/project_get";
import * as ProjectListService from "./service/project_list";
import * as ProjectPermissionGrantService from "./service/project_permission_grant";
import * as ProjectPermissionRevokeService from "./service/project_permission_revoke";
import * as ProjectPermissionsListService from "./service/project_permissions_list";
import * as ProjectProjectedBudgetDeleteService from "./service/project_projected_budget_delete";
import * as ProjectProjectedBudgetUpdateService from "./service/project_projected_budget_update";
import * as ProjectTraceEventsService from "./service/project_trace_events";
import * as ProjectUpdateService from "./service/project_update";
import { ConnectionSettings } from "./service/RpcClient.h";
import * as SubprojectAssignService from "./service/subproject_assign";
import * as SubprojectCloseService from "./service/subproject_close";
import * as SubprojectCreateService from "./service/subproject_create";
import * as SubprojectGetService from "./service/subproject_get";
import * as SubprojectListService from "./service/subproject_list";
import * as SubprojectPermissionGrantService from "./service/subproject_permission_grant";
import * as SubprojectPermissionRevokeService from "./service/subproject_permission_revoke";
import * as SubprojectPermissionListService from "./service/subproject_permissions_list";
import * as SubprojectProjectedBudgetDeleteService from "./service/subproject_projected_budget_delete";
import * as SubprojectProjectedBudgetUpdateService from "./service/subproject_projected_budget_update";
import * as SubprojectTraceEventsService from "./service/subproject_trace_events";
import * as SubprojectUpdateService from "./service/subproject_update";
import * as UserAuthenticateService from "./service/user_authenticate";
import * as UserCreateService from "./service/user_create";
import * as UserPasswordChangeService from "./service/user_password_change";
import * as UserQueryService from "./service/user_query";
import * as WorkflowitemAssignService from "./service/workflowitem_assign";
import * as WorkflowitemCloseService from "./service/workflowitem_close";
import * as WorkflowitemCreateService from "./service/workflowitem_create";
import * as WorkflowitemGetService from "./service/workflowitem_get";
import * as WorkflowitemListService from "./service/workflowitem_list";
import * as WorkflowitemPermissionGrantService from "./service/workflowitem_permission_grant";
import * as WorkflowitemPermissionRevokeService from "./service/workflowitem_permission_revoke";
import * as WorkflowitemPermissionsListService from "./service/workflowitem_permissions_list";
import * as WorkflowitemTraceEventsService from "./service/workflowitem_trace_events";
import * as WorkflowitemUpdateService from "./service/workflowitem_update";
import * as WorkflowitemsReorderService from "./service/workflowitems_reorder";
import * as SubprojectAssignAPI from "./subproject_assign";
import * as SubprojectProjectedBudgetDeleteAPI from "./subproject_budget_delete_projected";
import * as SubprojectProjectedBudgetUpdateAPI from "./subproject_budget_update_projected";
import * as SubprojectCloseAPI from "./subproject_close";
import * as SubprojectCreateAPI from "./subproject_create";
import * as SubprojectListAPI from "./subproject_list";
import * as SubprojectPermissionGrantAPI from "./subproject_permission_grant";
import * as SubprojectPermissionRevokeAPI from "./subproject_permission_revoke";
import * as SubprojectPermissionListAPI from "./subproject_permissions_list";
import * as SubprojectUpdateAPI from "./subproject_update";
import * as SubprojectViewDetailsAPI from "./subproject_view_details";
import * as SubprojectViewHistoryAPI from "./subproject_view_history";
import * as SubprojectViewHistoryAPIv2 from "./subproject_view_history_v2";
import * as UserAuthenticateAPI from "./user_authenticate";
import * as UserCreateAPI from "./user_create";
import * as UserListAPI from "./user_list";
import * as UserPasswordChangeAPI from "./user_password_change";
import * as WorkflowitemAssignAPI from "./workflowitem_assign";
import * as WorkflowitemCloseAPI from "./workflowitem_close";
import * as WorkflowitemCreateAPI from "./workflowitem_create";
import * as WorkflowitemListAPI from "./workflowitem_list";
import * as WorkflowitemPermissionGrantAPI from "./workflowitem_permission_grant";
import * as WorkflowitemPermissionRevokeAPI from "./workflowitem_permission_revoke";
import * as WorkflowitemPermissionsListAPI from "./workflowitem_permissions_list";
import * as WorkflowitemUpdateAPI from "./workflowitem_update";
import * as WorkflowitemValidateDocumentAPI from "./workflowitem_validate_document";
import * as WorkflowitemViewHistoryAPI from "./workflowitem_view_history";
import * as WorkflowitemsReorderAPI from "./workflowitems_reorder";

const URL_PREFIX = "/api";

/*
 * Deal with the environment:
 */

const port: number = (process.env.PORT && parseInt(process.env.PORT, 10)) || 8080;

const jwtSecret: string = process.env.JWT_SECRET || randomString(32);
if (jwtSecret.length < 32) {
  logger.warn("Warning: the JWT secret key should be at least 32 characters long.");
}
const rootSecret: string = process.env.ROOT_SECRET || randomString(32);
if (!process.env.ROOT_SECRET) {
  logger.warn(`Warning: root password not set; autogenerated to ${rootSecret}`);
}
const organization: string = process.env.ORGANIZATION || "";
if (!organization) {
  logger.fatal(`Please set ORGANIZATION to the organization this node belongs to.`);
  process.exit(1);
}
const organizationVaultSecret: string = process.env.ORGANIZATION_VAULT_SECRET || "";
if (!organizationVaultSecret) {
  logger.fatal(
    `Please set ORGANIZATION_VAULT_SECRET to the secret key used to encrypt the organization's vault.`,
  );
  process.exit(1);
}

const SWAGGER_BASEPATH = process.env.SWAGGER_BASEPATH || "/";

/*
 * Initialize the components:
 */

const multichainHost = process.env.RPC_HOST || "localhost";
const backupApiPort = process.env.BACKUP_API_PORT || "8085";

const rpcSettings: ConnectionSettings = {
  protocol: "http",
  host: multichainHost,
  port: parseInt(process.env.RPC_PORT || "8000", 10),
  username: process.env.RPC_USER || "multichainrpc",
  password: process.env.RPC_PASSWORD || "s750SiJnj50yIrmwxPnEdSzpfGlTAHzhaUwgqKeb0G1j",
};

const env = process.env.NODE_ENV || "";

logger.info(
  { rpcSettings: rpcSettingsWithoutPassword(rpcSettings) },
  "Connecting to MultiChain node",
);
const db = Multichain.init(rpcSettings);
const { multichainClient } = db;

const server = createBasicApp(jwtSecret, URL_PREFIX, port, SWAGGER_BASEPATH, env);

/*
 * Run the app:
 */

// Enable useful traces of unhandled-promise warnings:
process.on("unhandledRejection", err => {
  logger.fatal({ err }, "UNHANDLED PROMISE REJECTION");
  process.exit(1);
});

function registerSelf(): Promise<boolean> {
  return multichainClient
    .getRpcClient()
    .invoke("listaddresses", "*", false, 1, 0)
    .then(addressInfos =>
      addressInfos
        .filter(info => info.ismine)
        .map(info => info.address)
        .find(_ => true),
    )
    .then(address => {
      const req = {
        body: {
          data: {
            address,
            organization,
          },
        },
      };
      return registerNode(multichainClient, req);
    })
    .then(() => true)
    .catch(() => false);
}

/*
 * Deprecated API-setup
 */

registerRoutes(server, db, URL_PREFIX, multichainHost, backupApiPort, () =>
  Cache.invalidateCache(db),
);

/*
 * APIs related to Global Permissions
 */

GlobalPermissionGrantAPI.addHttpHandler(server, URL_PREFIX, {
  grantGlobalPermission: (ctx, user, grantee, permission) =>
    GlobalPermissionGrantService.grantGlobalPermission(db, ctx, user, grantee, permission),
});

GlobalPermissionsGrantAllAPI.addHttpHandler(server, URL_PREFIX, {
  getGlobalPermissions: (ctx, user) =>
    GlobalPermissionsGetService.getGlobalPermissions(db, ctx, user),
  grantGlobalPermissions: (ctx, user, grantee, permission) =>
    GlobalPermissionGrantService.grantGlobalPermission(db, ctx, user, grantee, permission),
});

GlobalPermissionRevokeAPI.addHttpHandler(server, URL_PREFIX, {
  revokeGlobalPermission: (ctx, user, revokee, permission) =>
    GlobalPermissionRevokeService.revokeGlobalPermission(db, ctx, user, revokee, permission),
});

GlobalPermissionsListAPI.addHttpHandler(server, URL_PREFIX, {
  getGlobalPermissions: (ctx, user) =>
    GlobalPermissionsGetService.getGlobalPermissions(db, ctx, user),
});

/*
 * APIs related to Users
 */

UserAuthenticateAPI.addHttpHandler(
  server,
  URL_PREFIX,
  {
    authenticate: (ctx, userId, password) =>
      UserAuthenticateService.authenticate(
        organization,
        organizationVaultSecret,
        rootSecret,
        db,
        ctx,
        userId,
        password,
      ),
    getGroupsForUser: (ctx, serviceUser, userId) =>
      GroupQueryService.getGroupsForUser(db, ctx, serviceUser, userId),
  },
  jwtSecret,
);

UserCreateAPI.addHttpHandler(server, URL_PREFIX, {
  createUser: (ctx, issuer, reqData) =>
    UserCreateService.createUser(organizationVaultSecret, db, ctx, issuer, reqData),
});

UserListAPI.addHttpHandler(server, URL_PREFIX, {
  listUsers: (ctx, issuer) => UserQueryService.getUsers(db, ctx, issuer),
  listGroups: (ctx, issuer) => GroupQueryService.getGroups(db, ctx, issuer),
});

UserPasswordChangeAPI.addHttpHandler(server, URL_PREFIX, {
  changeUserPassword: (ctx, issuer, reqData) =>
    UserPasswordChangeService.changeUserPassword(db, ctx, issuer, reqData),
});

/*
 * APIs related to Groups
 */

GroupCreateAPI.addHttpHandler(server, URL_PREFIX, {
  createGroup: (ctx, issuer, reqData) => GroupCreateService.createGroup(db, ctx, issuer, reqData),
});

GroupListAPI.addHttpHandler(server, URL_PREFIX, {
  listGroups: (ctx, issuer) => GroupQueryService.getGroups(db, ctx, issuer),
});

GroupMemberAddAPI.addHttpHandler(server, URL_PREFIX, {
  addGroupMember: (ctx, issuer, groupId, newMember) =>
    GroupMemberAddService.addMember(db, ctx, issuer, groupId, newMember),
});

GroupMemberRemoveAPI.addHttpHandler(server, URL_PREFIX, {
  removeGroupMember: (ctx, issuer, groupId, newMember) =>
    GroupMemberRemoveService.removeMember(db, ctx, issuer, groupId, newMember),
});

/*
 * APIs related to Notifications
 */

NotificationListAPI.addHttpHandler(server, URL_PREFIX, {
  getNotificationsForUser: (ctx, user) =>
    NotificationListService.getNotificationsForUser(db, ctx, user),
  getProject: (ctx, user, projectId) => ProjectGetService.getProject(db, ctx, user, projectId),
  getSubproject: (ctx, user, projectId, subprojectId) =>
    SubprojectGetService.getSubproject(db, ctx, user, projectId, subprojectId),
  getWorkflowitem: (ctx, user, projectId, subprojectId, workflowitemId) =>
    WorkflowitemGetService.getWorkflowitem(db, ctx, user, projectId, subprojectId, workflowitemId),
});

NotificationCountAPI.addHttpHandler(server, URL_PREFIX, {
  getNotificationsForUser: (ctx, user) =>
    NotificationListService.getNotificationsForUser(db, ctx, user),
});

NotificationMarkReadAPI.addHttpHandler(server, URL_PREFIX, {
  markRead: (ctx, user, notificationId) =>
    NotificationMarkReadService.markRead(db, ctx, user, notificationId),
});

/*
 * APIs related to Projects
 */

ProjectAssignAPI.addHttpHandler(server, URL_PREFIX, {
  assignProject: (ctx, user, projectId, assignee) =>
    ProjectAssignService.assignProject(db, ctx, user, projectId, assignee),
});

ProjectCloseAPI.addHttpHandler(server, URL_PREFIX, {
  closeProject: (ctx, user, projectId) =>
    ProjectCloseService.closeProject(db, ctx, user, projectId),
});

ProjectCreateAPI.addHttpHandler(server, URL_PREFIX, {
  createProject: (ctx, user, body) => ProjectCreateService.createProject(db, ctx, user, body),
});

ProjectUpdateAPI.addHttpHandler(server, URL_PREFIX, {
  updateProject: (ctx, user, projectId, reqData) =>
    ProjectUpdateService.updateProject(db, ctx, user, projectId, reqData),
});

ProjectPermissionGrantAPI.addHttpHandler(server, URL_PREFIX, {
  grantProjectPermission: (ctx, user, projectId, grantee, intent) =>
    ProjectPermissionGrantService.grantProjectPermission(db, ctx, user, projectId, grantee, intent),
});

ProjectPermissionRevokeAPI.addHttpHandler(server, URL_PREFIX, {
  revokeProjectPermission: (ctx, user, projectId, grantee, intent) =>
    ProjectPermissionRevokeService.revokeProjectPermission(
      db,
      ctx,
      user,
      projectId,
      grantee,
      intent,
    ),
});

ProjectPermissionsListAPI.addHttpHandler(server, URL_PREFIX, {
  getProjectPermissions: (ctx, user, projectId) =>
    ProjectPermissionsListService.getProjectPermissions(db, ctx, user, projectId),
});

ProjectListAPI.addHttpHandler(server, URL_PREFIX, {
  listProjects: (ctx, user) => ProjectListService.listProjects(db, ctx, user),
});

ProjectViewDetailsAPI.addHttpHandler(server, URL_PREFIX, {
  getProject: (ctx, user, projectId) => ProjectGetService.getProject(db, ctx, user, projectId),
  getSubprojects: (ctx, user, projectId) =>
    SubprojectListService.listSubprojects(db, ctx, user, projectId),
});

ProjectViewHistoryAPI.addHttpHandler(server, URL_PREFIX, {
  getProject: (ctx, user, projectId) => ProjectGetService.getProject(db, ctx, user, projectId),
  getSubprojects: (ctx, user, projectId) =>
    SubprojectListService.listSubprojects(db, ctx, user, projectId),
});

ProjectViewHistoryAPIv2.addHttpHandler(server, URL_PREFIX, {
  getProjectTraceEvents: (ctx, user, projectId) =>
    ProjectTraceEventsService.getTraceEvents(db, ctx, user, projectId),
});

ProjectProjectedBudgetUpdateAPI.addHttpHandler(server, URL_PREFIX, {
  updateProjectedBudget: (ctx, user, projectId, orga, amount, currencyCode) =>
    ProjectProjectedBudgetUpdateService.updateProjectedBudget(
      db,
      ctx,
      user,
      projectId,
      orga,
      amount,
      currencyCode,
    ),
});

ProjectProjectedBudgetDeleteAPI.addHttpHandler(server, URL_PREFIX, {
  deleteProjectedBudget: (ctx, user, projectId, orga, currencyCode) =>
    ProjectProjectedBudgetDeleteService.deleteProjectedBudget(
      db,
      ctx,
      user,
      projectId,
      orga,
      currencyCode,
    ),
});

/*
 * APIs related to Subprojects
 */

SubprojectAssignAPI.addHttpHandler(server, URL_PREFIX, {
  assignSubproject: (ctx, user, projectId, subprojectId, assignee) =>
    SubprojectAssignService.assignSubproject(db, ctx, user, projectId, subprojectId, assignee),
});

SubprojectCloseAPI.addHttpHandler(server, URL_PREFIX, {
  closeSubproject: (ctx, user, projectId, subprojectId) =>
    SubprojectCloseService.closeSubproject(db, ctx, user, projectId, subprojectId),
});

SubprojectCreateAPI.addHttpHandler(server, URL_PREFIX, {
  createSubproject: (ctx, user, body) =>
    SubprojectCreateService.createSubproject(db, ctx, user, body),
});

SubprojectListAPI.addHttpHandler(server, URL_PREFIX, {
  listSubprojects: (ctx, user, projectId) =>
    SubprojectListService.listSubprojects(db, ctx, user, projectId),
});

SubprojectViewDetailsAPI.addHttpHandler(server, URL_PREFIX, {
  getProject: (ctx, user, projectId) => ProjectGetService.getProject(db, ctx, user, projectId),
  getSubproject: (ctx, user, projectId, subprojectId) =>
    SubprojectGetService.getSubproject(db, ctx, user, projectId, subprojectId),
  getWorkflowitems: (ctx, user, projectId, subprojectId) =>
    WorkflowitemListService.listWorkflowitems(db, ctx, user, projectId, subprojectId),
});

SubprojectViewHistoryAPI.addHttpHandler(server, URL_PREFIX, {
  getSubproject: (ctx, user, projectId, subprojectId) =>
    SubprojectGetService.getSubproject(db, ctx, user, projectId, subprojectId),
  getWorkflowitems: (ctx, user, projectId, subprojectId) =>
    WorkflowitemListService.listWorkflowitems(db, ctx, user, projectId, subprojectId),
});

SubprojectViewHistoryAPIv2.addHttpHandler(server, URL_PREFIX, {
  getSubprojectTraceEvents: (ctx, user, projectId, subprojectId) =>
    SubprojectTraceEventsService.getTraceEvents(db, ctx, user, projectId, subprojectId),
});

SubprojectPermissionListAPI.addHttpHandler(server, URL_PREFIX, {
  listSubprojectPermissions: (ctx, user, projectId, subprojectId) =>
    SubprojectPermissionListService.listSubprojectPermissions(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
    ),
});

SubprojectPermissionGrantAPI.addHttpHandler(server, URL_PREFIX, {
  grantSubprojectPermission: (ctx, user, projectId, subprojectId, grantee, intent) =>
    SubprojectPermissionGrantService.grantSubprojectPermission(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      grantee,
      intent,
    ),
});

SubprojectPermissionRevokeAPI.addHttpHandler(server, URL_PREFIX, {
  revokeSubprojectPermission: (ctx, user, projectId, subprojectId, revokeee, intent) =>
    SubprojectPermissionRevokeService.revokeSubprojectPermission(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      revokeee,
      intent,
    ),
});

SubprojectProjectedBudgetUpdateAPI.addHttpHandler(server, URL_PREFIX, {
  updateProjectedBudget: (ctx, user, projectId, subprojectId, orga, amount, currencyCode) =>
    SubprojectProjectedBudgetUpdateService.updateProjectedBudget(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      orga,
      amount,
      currencyCode,
    ),
});

SubprojectProjectedBudgetDeleteAPI.addHttpHandler(server, URL_PREFIX, {
  deleteProjectedBudget: (ctx, user, projectId, subprojectId, orga, currencyCode) =>
    SubprojectProjectedBudgetDeleteService.deleteProjectedBudget(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      orga,
      currencyCode,
    ),
});

WorkflowitemsReorderAPI.addHttpHandler(server, URL_PREFIX, {
  setWorkflowitemOrdering: (ctx, user, projectId, subprojectId, ordering) =>
    WorkflowitemsReorderService.setWorkflowitemOrdering(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      ordering,
    ),
});

SubprojectUpdateAPI.addHttpHandler(server, URL_PREFIX, {
  updateSubproject: (ctx, user, projectId, subprojectId, requestData) =>
    SubprojectUpdateService.updateSubproject(db, ctx, user, projectId, subprojectId, requestData),
});

/*
 * APIs related to Workflowitem
 */

WorkflowitemListAPI.addHttpHandler(server, URL_PREFIX, {
  listWorkflowitems: (ctx, user, projectId, subprojectId) =>
    WorkflowitemListService.listWorkflowitems(db, ctx, user, projectId, subprojectId),
});

WorkflowitemViewHistoryAPI.addHttpHandler(server, URL_PREFIX, {
  getWorkflowitemTraceEvents: (ctx, user, projectId, subprojectId, workflowitemId) =>
    WorkflowitemTraceEventsService.getTraceEvents(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
    ),
});

WorkflowitemPermissionsListAPI.addHttpHandler(server, URL_PREFIX, {
  listWorkflowitemPermissions: (ctx, user, projectId, subprojectId, workflowitemId) =>
    WorkflowitemPermissionsListService.listWorkflowitemPermissions(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
    ),
});

WorkflowitemCloseAPI.addHttpHandler(server, URL_PREFIX, {
  closeWorkflowitem: (ctx, user, projectId, subprojectId, workflowitemId) =>
    WorkflowitemCloseService.closeWorkflowitem(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
    ),
});

WorkflowitemCreateAPI.addHttpHandler(server, URL_PREFIX, {
  createWorkflowitem: (ctx, user, requestData) =>
    WorkflowitemCreateService.createWorkflowitem(db, ctx, user, requestData),
});

WorkflowitemAssignAPI.addHttpHandler(server, URL_PREFIX, {
  assignWorkflowItem: (ctx, user, projectId, subprojectId, workflowitemId, assignee) =>
    WorkflowitemAssignService.assignWorkflowitem(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
      assignee,
    ),
});

WorkflowitemPermissionGrantAPI.addHttpHandler(server, URL_PREFIX, {
  grantWorkflowitemPermission: (
    ctx,
    user,
    projectId,
    subprojectId,
    workflowitemId,
    grantee,
    intent,
  ) =>
    WorkflowitemPermissionGrantService.grantWorkflowitemPermission(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
      grantee,
      intent,
    ),
});

WorkflowitemPermissionRevokeAPI.addHttpHandler(server, URL_PREFIX, {
  revokeWorkflowitemPermission: (
    ctx,
    user,
    projectId,
    subprojectId,
    workflowitemId,
    revokee,
    intent,
  ) =>
    WorkflowitemPermissionRevokeService.revokeWorkflowitemPermission(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
      revokee,
      intent,
    ),
});

WorkflowitemUpdateAPI.addHttpHandler(server, URL_PREFIX, {
  updateWorkflowitem: (ctx, user, projectId, subprojectId, workflowitemId, data) =>
    WorkflowitemUpdateService.updateWorkflowitem(
      db,
      ctx,
      user,
      projectId,
      subprojectId,
      workflowitemId,
      data,
    ),
});

WorkflowitemValidateDocumentAPI.addHttpHandler(server, URL_PREFIX, {
  matches: (documentBase64: string, expectedSHA256: string) =>
    DocumentValidationService.isSameDocument(documentBase64, expectedSHA256),
});

/*
 * Run the server.
 */

server.listen(port, "0.0.0.0", async err => {
  if (err) {
    logger.fatal({ err }, "Connection could not be established. Aborting.");
    console.trace();
    process.exit(1);
  }

  const retryIntervalMs = 5000;

  while (!(await isReady(multichainClient))) {
    logger.info(
      `MultiChain connection/permissions not ready yet. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }

  while (
    !(await ensureOrganizationStream(multichainClient, organization!, organizationVaultSecret!)
      .then(() => true)
      .catch(() => false))
  ) {
    logger.info(
      { multichainClient, organization },
      `Failed to create organization stream. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }
  logger.debug({ multichainClient, organization }, "Organization stream present");

  while (!(await registerSelf())) {
    logger.info(
      { multichainClient, organization },
      `Failed to register node. Trying again in ${retryIntervalMs / 1000}s`,
    );
    await timeout(retryIntervalMs);
  }
  logger.debug({ params: { multichainClient, organization } }, "Node registered in nodes stream");
});

function rpcSettingsWithoutPassword(settings) {
  const tmp = deepcopy(settings);
  delete tmp.password;
  return tmp;
}
