/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// TODO: Currently we have to redefine the JSON format in both backend and client side
// maybe we could unify the definition in one place and referenced by two projects
import axios from "axios";
import { log } from "./helper";
import { useToast } from "vue-toastification";

const toast = useToast();

export const API_SERVER = `http://${location.hostname}:16666`;

export const enum ActionsTypes {
  BuilderArgsChange = 1,
  BuildStepChange,
  ConfigEnvChange,
  ConfigOptionChange,
  FileChange,
  ShowSuggestion,
  ShowDepRecipe,
}

export const enum ConfigParameterTypes {
  nativeLibrary = 1,
  dependency,
}

export interface IJsonObject {
  __type__: string;
}

//////////////////////////////////////////////////////////////////
// Actions
//////////////////////////////////////////////////////////////////
export type ArgChangeType = "replace" | "merge" | "delete" | "deleteAll";

export interface FileRegion extends IJsonObject {
  __type__: "FileRegion";
  file: string;
  lineStart: number;
  lineEnd: number;
}

export interface FileLocation extends IJsonObject {
  __type__: "FileLocation";
  file: string;
  line: number;
  col: number;
}

export interface IAction extends IJsonObject {
  desc: string;
}

export interface FileChangeAction extends IAction {
  __type__: "FileChange";
  region: FileRegion;
  newContent: string | null;
}

export interface ArgChange {
  option: string;
  value: string | null;
  type: ArgChangeType;
}

export interface BuilderArgsChangeAction extends IAction {
  __type__: "BuilderArgsChange";
  args: ArgChange[];
  builderID: number;
}

export interface BuildStepRegion extends IJsonObject {
  __type__: "BuildStepRegion";
  iStart: number;
  iEnd: number;
}

export interface BuildStepChangeAction extends IAction {
  __type__: "BuildStepChange";
  region: BuildStepRegion;
  newBuildSteps: Builder[];
}

export interface SuggestionExample extends IJsonObject {
  __type__: "SuggestionExample";
  before: string;
  after: string;
}

export interface ShowSuggestionAction extends IAction {
  __type__: "ShowSuggestion";
  suggestion: SuggestionExample;
  region: FileRegion;
}

export interface ConfigEnvChangeAction extends IAction {
  __type__: "ConfigEnvChange";
  partToUpdate: { [k: string]: ArgChange[] };
}

export interface ConfigOptionChangeAction extends IAction {
  __type__: "ConfigOptionChange";
  partToUpdate: { [k: string]: boolean };
}

export interface ShowDepRecipeAction extends IAction {
  __type__: "ShowDepRecipe";
  deps: string[];
}

//////////////////////////////////////////////////////////////////
// AdviseRequests
//////////////////////////////////////////////////////////////////

export interface IAdviseRequest extends IJsonObject {
  tags: string[];
}

export interface ErrorAdviseRequest extends IAdviseRequest {
  __type__: "ErrorAdviseRequest";
  error: string;
  location: FileLocation;
  builder: number;
}

export interface PlainAdviseRequest extends IAdviseRequest {
  __type__: "PlainAdviseRequest";
  plainData: unknown;
}

//////////////////////////////////////////////////////////////////
// Recipe
//////////////////////////////////////////////////////////////////

export interface Recipe extends IJsonObject {
  __type__: "Recipe";
  proj: string;
  desc: string;
  advisor: string;
  requests: IAdviseRequest[];
  actions: IAction[];
  showNoAdvisor: boolean;
}

//////////////////////////////////////////////////////////////////
// Builder
//////////////////////////////////////////////////////////////////

export interface Builder extends IJsonObject {
  desc: string;
  args: string;
  rootBuildFilePath: string;
  [k: string]: unknown;
}

export interface CMakeBuilder extends Builder {}
export interface MakeBuilder extends Builder {}
export interface ConfigureBuilder extends Builder {}
export interface EmccBuilder extends Builder {}
export interface NativeBuilder extends Builder {}

export const AVAILABLE_BUILDERS: { [k: string]: { title: string; skeleton: Builder } } = {
  CMakeBuilder: {
    title: "CMake",
    skeleton: {
      __type__: "CMakeBuilder",
      desc: "Original project built with CMake. Webinizer will use emcmake.",
      args: "",
      rootBuildFilePath: "${projectRoot}",
    },
  },
  ConfigureBuilder: {
    title: "configure",
    skeleton: {
      __type__: "ConfigureBuilder",
      desc: "Original project built with configure of autotools. Webinizer will use emconfigure.",
      args: "",
      rootBuildFilePath: "${projectRoot}",
    },
  },
  MakeBuilder: {
    title: "Make",
    skeleton: {
      __type__: "MakeBuilder",
      desc: "Original project built with Make. Webinizer will use emmake.",
      args: "",
      rootBuildFilePath: "${projectRoot}",
    },
  },
  EmccBuilder: {
    title: "cc",
    skeleton: {
      __type__: "EmccBuilder",
      desc: "Original project built with CC. Webinizer will use emcc.",
      args: "",
      rootBuildFilePath: "${projectRoot}",
    },
  },
  NativeBuilder: {
    title: "run native commands",
    skeleton: {
      __type__: "NativeBuilder",
      desc: "Run native commands without emscripten configs.",
      args: "",
      rootBuildFilePath: "${projectRoot}",
    },
  },
};

//////////////////////////////////////////////////////////////////
// ProjectConfig
//////////////////////////////////////////////////////////////////
/* environment variables */
export type EnvType = "cflags" | "ldflags";
export type ProjectEnv = {
  [k in EnvType]: string;
};

/* package configs */
export type PkgConfigType = "prefix" | EnvType;
export type ProjectPkgConfig = {
  [k in PkgConfigType]: string;
};

/* package information */
export type PkgInfoType = "name" | "version";
export type ProjectPkgInfo = {
  [k in PkgInfoType]: string;
};

/* package resolution */
export type PkgResolutionType = PkgInfoType | "destination";
export type PkgResolution = {
  [k in PkgResolutionType]: string;
};

/* display mode for projects in get started page */
export type DisplayMode = "card" | "list";

export interface ProjectProfile extends IJsonObject {
  name?: string;
  path?: string;
  desc?: string;
  img?: ProjectIcon;
  category?: string;
  id?: number;
  version?: string;
}

export interface ProjectPerson {
  name: string;
  email?: string;
  url?: string;
}

export interface ProjectRepository {
  type: string;
  url: string;
}

export interface ProjectBuildTargetConfig {
  builders?: Builder[];
  envs?: ProjectEnv;
  preloadFiles?: string[];
  exportedFuncs?: string;
  exportedRuntimeMethods?: string;
  options?: { [k: string]: boolean };
  disabledAdvisors?: { [k: string]: boolean };
  pkgConfig?: ProjectPkgConfig;
}

export interface ProjectConfig extends IJsonObject {
  name?: string;
  version?: string;
  desc?: string;
  deps?: string[];
  dependencies?: { [k: string]: string };
  buildTargets?: { [k: string]: ProjectBuildTargetConfig };
  target?: string;
  isLibrary?: boolean;
  nativeLibrary?: ProjectPkgInfo;
  overallEnvs?: ProjectEnv;
  resolutions?: PkgResolution[];
  requiredBy?: { [k: string]: string };
  author?: ProjectPerson;
  keywords?: string[];
  repository?: ProjectRepository;
  homepage?: string;
  bugs?: string;
  license?: string;
  img?: ProjectIcon;
}

//////////////////////////////////////////////////////////////////
// File
//////////////////////////////////////////////////////////////////

export interface EditFile {
  name: string;
  content: string;
}

export interface DTreeNode {
  path: string;
  name: string;
  type: string;
  children?: DTreeNode[];
}

export interface ProjectDirTree {
  tree: DTreeNode;
}

//////////////////////////////////////////////////////////////////
// Build Status
//////////////////////////////////////////////////////////////////

export enum ProjectAddStatus {
  processing = "processing",
  done = "done",
}

export enum ProjectPublishStatus {
  processing = "processing",
  success = "success",
  fail = "fail",
}

export enum ProjectDepUpdateStatus {
  processing = "processing",
  done = "done",
}

// "building" - project is under building w/o recipes
// "building_with_recipes" - project is under building w/ recipes
// "idle_success" - project is idle after successful build
// "idle_fail" - project is idle after failure build
// "idle_default" - the initial idle status without any build
export type statusType =
  | "building"
  | "building_with_recipes"
  | "idle_success"
  | "idle_fail"
  | "idle_default";

export interface ProjectAddResult {
  status?: ProjectAddStatus;
  path?: string;
}

//////////////////////////////////////////////////////////////////
// Build Result
//////////////////////////////////////////////////////////////////
export interface ResultFile {
  path: string;
  name: string;
  type: "file" | "directory";
  size: number;
  date: Date;
}

export interface TargetResult {
  target: string;
  type: "executable" | "library";
  result: ResultFile[];
}

export interface ResultTimestamp {
  tStart: Date;
  tEnd: Date;
  tDur: number;
}

export interface ProjectResult extends IJsonObject {
  files: TargetResult[];
  timestamps: ResultTimestamp;
}

//////////////////////////////////////////////////////////////////
// Packages
//////////////////////////////////////////////////////////////////
export interface PackageSearchResult {
  name: string;
  version: string;
  description?: string;
}

//////////////////////////////////////////////////////////////////
// Settings
//////////////////////////////////////////////////////////////////
export interface IExtensionSettingsJson {
  desc: string;
  status: "enable" | "disable";
}

export interface WebinizerSettings {
  registry?: string;
  extensions?: { [k: string]: IExtensionSettingsJson };
}

export interface ProjectIcon {
  name: string;
  isUploaded: boolean;
}

//////////////////////////////////////////////////////////////////
// APIs
//////////////////////////////////////////////////////////////////

// set interceptors for each request
axios.interceptors.request.use((config) => config);

// set interceptors for each response
axios.interceptors.response.use(
  // success
  (response) => response,
  // fail
  (error) => manageAxiosInterceptorError(error)
);

function manageAxiosInterceptorError(error: any) {
  if (error.response) {
    switch (error.response.status) {
      case 500:
        break;
      default:
        if (checkIfNeedToast(error)) {
          toast.error(error.response.data.message);
        }
        // return error response data details temporarily
        throw new Error("axiosErrorMessage", { cause: error.response.data.message });
    }
  }
}

function checkIfNeedToast(error: any): boolean {
  //SECTION - 1: API: /api/projects/{root}/files/{name} - 'WEBINIZER_FILE_UNSUPPORTED_ENCODING'
  if (
    String(error.config.url).includes("/api/projects/{root}/files/{name}") &&
    String(error.response.data.name) === "WEBINIZER_FILE_UNSUPPORTED_ENCODING"
  ) {
    return false;
  }
  return true;
}

export async function applyRecipesAndBuild(root: string, recipes?: Recipe[]): Promise<Recipe[]> {
  log.info(">>> applyRecipesAndBuild", root, recipes);
  const response = await axios.post(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/construction`,
    {
      recipes,
    }
  );
  log.info("<<< applyRecipesAndBuild", response.data);
  return response.data.recipes as Recipe[];
}

export async function getRecipes(root: string): Promise<Recipe[]> {
  log.info(">>> getRecipes", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/recipes`
  );
  log.info("<<< getRecipes", response.data);
  return response.data.recipes as Recipe[];
}

export async function getProjectConfig(root: string): Promise<ProjectConfig> {
  log.info(">>> getProjectConfig", root);
  const response = await axios.get(`${API_SERVER}/api/projects/${encodeURIComponent(root)}/config`);
  log.info("<<< getProjectConfig", response.data);
  return response.data as ProjectConfig;
}

export async function updateProjectConfig(
  root: string,
  config: ProjectConfig
): Promise<ProjectConfig> {
  log.info(">>> updateProjectConfig", root, config);
  const response = await axios.put(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/config`,
    {
      config,
    }
  );
  log.info("<<< updateProjectConfig", response.data);
  return response.data as ProjectConfig;
}

export async function updateProjectConfigPart(
  root: string,
  config: { [k: string]: unknown }
): Promise<ProjectConfig> {
  log.info(">>> updateProjectConfigPart", root, config);
  const response = await axios.put(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/config`,
    {
      config,
    }
  );
  log.info("<<< updateProjectConfigPart", response.data);
  return response.data as ProjectConfig;
}

export async function resetProjectConfig(root: string): Promise<ProjectConfig> {
  log.info(">>> resetProjectConfig", root);
  const response = await axios.patch(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/config`
  );
  log.info("<<< resetProjectConfig", response.data);
  return response.data as ProjectConfig;
}

export async function updateProjectBuildConfig(root: string, config: { [k: string]: unknown }) {
  log.info(">>> updateProjectBuildConfig", root, config);
  const response = await axios.put(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/config/build-options`,
    {
      config,
    }
  );
  log.info("<<< updateProjectBuildConfig", response.data);
  return response.data as ProjectConfig;
}

export async function updateOverallEnvsFromDeps(root: string) {
  log.info(">>> updateOverallEnvsFromDeps", root);
  const response = await axios.put(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/config/overall-envs-deps`
  );
  log.info("<<< updateOverallEnvsFromDeps", response.data);
  return response.data as ProjectConfig;
}

export async function recommendBuilders(root: string): Promise<Builder[]> {
  log.info(">>> recommendBuilders", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/builders/recommended-builders`
  );
  log.info("<<< recommendBuilders", response.data);
  return response.data.builders as Builder[];
}

export async function getAllBuilders(root: string): Promise<Builder[]> {
  log.info(">>> getAllBuilders", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/builders`
  );
  log.info("<<< getAllBuilders", response.data);
  return response.data.builders as Builder[];
}

export async function disableAdvisor(root: string, advisor: string): Promise<ProjectConfig> {
  log.info(">>> disableAdvisor", root, advisor);
  const response = await axios.patch(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/advisor`,
    {
      advisor,
    }
  );
  log.info("<<< disableAdvisor", response.data);
  return response.data as ProjectConfig;
}

export async function getFileContent(root: string, name: string): Promise<EditFile> {
  log.info(">>> getFileContent", name);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/files/${encodeURIComponent(name)}`
  );
  log.info("<<< getFileContent", response.data);
  return response.data as EditFile;
}

function formatLogContent(content: string): string {
  /**
   * format log content since it use linux terminal recognized format
   */
  const patternArr = new Map<string, RegExp>([
    ["timeReg", /[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/g],
    ["typeReg", /(info|warn|error)/g],
    // each builder will be decorated with the color from `chalk`
    // module, and its color tag is `\u001b[92m`
    ["builderReg", /\\u001b\[92m(\w+)/],
    ["contentReg", /\s[a-zA-Z]*\s.*/g],
  ]);

  let logContentStr = "";
  let useOriginal = false;
  const logContentArr = content.split("\n");

  for (const lineContent of logContentArr) {
    if (lineContent === "") {
      continue;
    }

    for (const pattern of patternArr.keys()) {
      if (lineContent.match(patternArr.get("timeReg")!) === null) {
        useOriginal = true;
        break;
      } else if (lineContent.match(patternArr.get(pattern)!) === null) {
        continue;
      } else {
        switch (pattern) {
          case "timeReg":
          case "typeReg":
            logContentStr = logContentStr.concat(
              "[",
              lineContent.match(patternArr.get(pattern)!)![0],
              "] "
            );
            break;
          case "builderReg": {
            const match = lineContent.match(patternArr.get(pattern)!);
            if (match) {
              logContentStr = logContentStr.concat("[", match[1], "] ");
            }
            break;
          }

          default:
            logContentStr = logContentStr.concat(lineContent.match(patternArr.get(pattern)!)![0]);
            break;
        }
        useOriginal = false;
      }
    }

    if (useOriginal) {
      logContentStr = logContentStr.concat(lineContent, "\n");
    } else {
      logContentStr = logContentStr.concat("\n");
    }
  }

  return logContentStr;
}

export async function getLogContent(root: string): Promise<string> {
  log.info(">>> getLogContent", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/construction/logs`
  );
  log.info("<<< getLogContent", response.data.content);
  return formatLogContent(response.data.content);
}

export async function updateFileContent(
  root: string,
  name: string,
  content: string
): Promise<EditFile> {
  log.info(">>> updateFileContent", name, content);
  const response = await axios.put(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/files/${encodeURIComponent(name)}`,
    {
      content,
    }
  );
  log.info("<<< updateFileContent", response.data);
  return response.data as EditFile;
}

export async function getFileDirPath(root: string, dir: string): Promise<ProjectDirTree> {
  log.info(">>> getFileDirPath", root, dir);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/directory-tree/${encodeURIComponent(
      dir
    )}`
  );
  log.info("<<< getFileDirPath", response.data);
  return response.data as ProjectDirTree;
}

export async function getProjects(): Promise<ProjectProfile[]> {
  log.info(">>> getProjects");
  const response = await axios.get(`${API_SERVER}/api/projects/profile`);
  log.info("<<< getProjects", response.data);
  return response.data.profiles as ProjectProfile[];
}

export async function getDeletedProjects(): Promise<ProjectProfile[]> {
  log.info(">>> get deleted projects");
  const response = await axios.get(`${API_SERVER}/api/projects/profile/deleted`);
  log.info("<<<  get deleted projects", response.data);
  return response.data.profiles as ProjectProfile[];
}

export async function saveAsNewFile(
  root: string,
  name: string,
  content: string
): Promise<EditFile> {
  log.info(">>> saveAsNewFile", name, content);
  const response = await axios.post(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/files`,
    {
      name: encodeURIComponent(name),
      content,
    }
  );
  log.info("<<< saveAsNewFile", response.data);
  return response.data as EditFile;
}

export async function evalTemplateLiterals(root: string, template: string): Promise<string> {
  log.info(">>> evalTemplateLiterals", root, template);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/templates/${encodeURIComponent(
      template
    )}/evaluation-literals`
  );
  log.info("<<< evalTemplateLiterals", response.data.val);
  return response.data.val as string;
}

export async function getAllTemplateLiterals(root: string): Promise<string[]> {
  log.info(">>> getAllTemplateLiterals", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/templates`
  );
  log.info("<<< getAllTemplateLiterals", response.data.templates);
  return response.data.templates as string[];
}

export async function getBuildStatus(root: string): Promise<statusType> {
  log.info(">>> getBuildStatus", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/construction/status`
  );
  log.info("<<< getBuildStatus", response.data.status);
  return response.data.status as statusType;
}

export async function getBuildResults(root: string): Promise<ProjectResult | null> {
  log.info(">>> getBuildResults", root);
  const response = await axios.get(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/construction/results`
  );
  log.info("<<< getBuildResults", response.data);
  return response.data as ProjectResult;
}

export async function uploadProjectFile(formData: FormData): Promise<ProjectAddResult> {
  log.info(">>> uploadProjectFile", formData);
  const response = await axios.post(`${API_SERVER}/api/projects/zip-file`, formData);
  log.info("<<< uploadProjectFile", response.data);
  response.data.path = decodeURIComponent(response.data.path);
  return response.data as ProjectAddResult;
}

export async function uploadProjectIcon(root: string, formData: FormData): Promise<ProjectConfig> {
  log.info(">>> uploadProjectIcon", formData);
  const response = await axios.post(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/icons`,
    formData
  );
  log.info("<<< uploadProjectIcon", response.data);
  return response.data as ProjectConfig;
}

export async function cloneProjectFromRemote(
  repoPath: string,
  config?: { [k: string]: unknown }
): Promise<ProjectAddResult> {
  log.info(">>> addProjectFromRemote", repoPath, config);
  const response = await axios.post(`${API_SERVER}/api/projects/github`, { repoPath, config });
  log.info("<<< addProjectFromRemote", response);
  response.data.path = decodeURIComponent(response.data.path);
  return response.data as ProjectAddResult;
}

export async function addProjectFromRegistry(
  spec: {
    [k: string]: string;
  },
  config: { [k: string]: unknown }
): Promise<ProjectAddResult> {
  log.info(">>> addProjectFromRegistry", spec);
  const response = await axios.post(`${API_SERVER}/api/projects/registry`, { spec, config });
  log.info("<<< addProjectFromRegistry", response);
  response.data.path = decodeURIComponent(response.data.path);
  return response.data as ProjectAddResult;
}

export async function deleteProject(root: string): Promise<ProjectProfile[]> {
  log.info(">>> delete project from disk", root);
  const response = await axios.delete(`${API_SERVER}/api/projects/${encodeURIComponent(root)}`);
  log.info("<<< delete project from disk", response);
  return response.data.profiles as ProjectProfile[];
}

export async function deleteProjects(rootArray: string[]): Promise<ProjectProfile[]> {
  log.info(">>> delete project from disk", rootArray);
  const params = { projectRootArray: rootArray.map((root) => encodeURIComponent(root)) || [] };
  const response = await axios.delete(`${API_SERVER}/api/projects`, {
    params,
  });
  log.info("<<< delete project from disk", response);
  return response.data.profiles as ProjectProfile[];
}

export async function publish(root: string): Promise<string> {
  log.info(">>> publish project", root);
  const response = await axios.post(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/publication`
  );
  log.info("<<< publish project", response);
  return response.data.status as string;
}

export async function search(words: string): Promise<PackageSearchResult[]> {
  log.info(">>> search package with keywords", words);
  const response = await axios.get(`${API_SERVER}/api/registry-packages/${words}`);
  log.info("<<< search package", response);
  return response.data.result as PackageSearchResult[];
}

export async function getWebinizerSettings(): Promise<WebinizerSettings> {
  log.info(">>> get webinizer settings");
  const response = await axios.get(`${API_SERVER}/api/settings`);
  log.info("<<< get webinizer settings", response);
  return response.data as WebinizerSettings;
}

export async function updateWebinizerSettings(
  settingParts: WebinizerSettings
): Promise<WebinizerSettings> {
  log.info(">>> update webinizer settings", settingParts);
  const response = await axios.post(`${API_SERVER}/api/settings`, { settingParts });
  log.info("<<< update webinizer settings", response);
  return response.data as WebinizerSettings;
}

export async function getAllAvailableIcons(root?: string): Promise<ProjectIcon[]> {
  log.info(">>> get all icons of the project", root);
  const params = { root: encodeURIComponent(root || "") };
  const response = await axios.get(`${API_SERVER}/api/projects/icons`, { params });
  log.info("<<< get all icons of the project", response);
  return response.data as ProjectIcon[];
}

/**
 *
 * @param root the project root path
 * @param img the url of this icon
 * @returns the icons object array after deleting
 */
export async function removeIcon(root: string, img: string): Promise<ProjectIcon[]> {
  log.info(">>> remove the icon of the project", img);
  const response = await axios.delete(
    `${API_SERVER}/api/projects/${encodeURIComponent(root)}/icons/${encodeURIComponent(img)}`
  );
  log.info("<<< remove the icon of the project", response);
  return response.data as ProjectIcon[];
}
