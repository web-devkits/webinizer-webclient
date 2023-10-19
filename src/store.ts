/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import createPersistedState from "vuex-persistedstate";
import * as webinizer from "./webinizer";

export interface State {
  root: string;
  projectConfig?: webinizer.ProjectConfig;
  recommendedBuilders?: webinizer.Builder[];
  availableBuilders?: webinizer.Builder[];
  recipes: webinizer.Recipe[];
  needSaveConfig: boolean;
  editFile?: webinizer.EditFile;
  logContent: string;
  openFiles: string[];
  fileDirTree: webinizer.DTreeNode[];
  projectsPool: webinizer.ProjectProfile[];
  buildingStatus: webinizer.statusType;
  buildResults?: webinizer.ProjectResult;
  templateLiterals: string[];
  lastApplyRecipeIndex: number;
  projAddStatus?: webinizer.ProjectAddStatus;
  projPublishStatus?: webinizer.ProjectPublishStatus;
  projDepUpdateStatus?: webinizer.ProjectDepUpdateStatus;
  depConfigs?: { [k: string]: webinizer.ProjectConfig };
  displayMode?: webinizer.DisplayMode;
  webinizerSettings?: webinizer.WebinizerSettings;
  availableIcons?: webinizer.Icons[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    root: "",
    recipes: [],
    projectConfig: undefined,
    needSaveConfig: false,
    editFile: undefined,
    logContent: "",
    openFiles: [],
    fileDirTree: [],
    projectsPool: [],
    buildingStatus: "idle_default",
    buildResults: undefined,
    templateLiterals: [],
    lastApplyRecipeIndex: -1,
    projAddStatus: undefined,
    projPublishStatus: undefined,
    projDepUpdateStatus: undefined,
    availableBuilders: [],
    depConfigs: undefined,
    displayMode: "card",
    webinizerSettings: undefined,
    availableIcons: [],
  },
  mutations: {
    initState(state: State) {
      state.root = "";
      state.recipes = [];
      state.projectConfig = undefined;
      state.needSaveConfig = false;
      state.editFile = undefined;
      state.openFiles = [];
      state.fileDirTree = [];
      state.buildingStatus = "idle_default";
      state.buildResults = undefined;
      state.templateLiterals = [];
      state.lastApplyRecipeIndex = -1;
      state.projAddStatus = undefined;
      state.projPublishStatus = undefined;
      state.projDepUpdateStatus = undefined;
      state.availableBuilders = [];
      state.depConfigs = undefined;
      state.availableIcons = [];
    },
    setRoot(state: State, root: string) {
      state.root = root;
    },
    setRecipes(state: State, recipes: webinizer.Recipe[]) {
      state.recipes = recipes;
    },
    setProjectConfig(state: State, config: webinizer.ProjectConfig) {
      state.projectConfig = config;
    },
    mergeProjectConfig(state: State, configToMerge: { [k: string]: unknown }) {
      if (!state.projectConfig) {
        state.projectConfig = { __type__: "ProjectConfig" };
      }
      Object.assign(state.projectConfig, configToMerge);
    },
    setNeedSaveConfig(state: State, needSave: boolean) {
      state.needSaveConfig = needSave;
    },
    setRecommendedBuilders(state: State, builders: webinizer.Builder[]) {
      state.recommendedBuilders = builders;
    },
    setAvailableBuilders(state: State, builders: webinizer.Builder[]) {
      state.availableBuilders = builders;
    },
    setFileContent(state: State, file: webinizer.EditFile | undefined) {
      state.editFile = file;
      if (file && !state.openFiles.find((element) => element === file.name)) {
        state.openFiles.push(file.name);
      }
    },

    setLogContent(state: State, content: string) {
      state.logContent = content;
    },

    setFileDirPath(state: State, content: webinizer.ProjectDirTree) {
      state.fileDirTree = [content.tree];
    },

    setProjectPool(state: State, projects: webinizer.ProjectProfile[]) {
      state.projectsPool = projects;
    },

    setTemplateLiterals(state: State, templates: string[]) {
      state.templateLiterals = templates;
    },

    setBuildingStatus(state: State, status: webinizer.statusType) {
      state.buildingStatus = status;
    },

    setBuildResults(state: State, results: webinizer.ProjectResult) {
      state.buildResults = results;
    },

    setLastApplyRecipeIndex(state: State, index: number) {
      state.lastApplyRecipeIndex = index;
    },

    setProjAddStatus(state: State, status: webinizer.ProjectAddStatus) {
      state.projAddStatus = status;
    },

    setProjPublishStatus(state: State, status: webinizer.ProjectPublishStatus) {
      state.projPublishStatus = status;
    },

    setProjDepUpdateStatus(state: State, status: webinizer.ProjectDepUpdateStatus) {
      state.projDepUpdateStatus = status;
    },

    setDependencyConfig(state: State, depConfig: { [k: string]: webinizer.ProjectConfig }) {
      if (!state.depConfigs) state.depConfigs = {};
      Object.assign(state.depConfigs, depConfig);
    },

    resetDependencyConfigs(state: State) {
      state.depConfigs = {};
    },

    setDisplayMode(state: State, mode: webinizer.DisplayMode) {
      state.displayMode = mode;
    },

    setWebinizerSettings(state: State, settings: webinizer.WebinizerSettings) {
      state.webinizerSettings = settings;
    },

    setAvailableIcons(state: State, icons: webinizer.Icons[]) {
      state.availableIcons = icons;
    },
  },

  actions: {
    async applyRecipesAndBuild({ commit, state }, recipes?: webinizer.Recipe[]) {
      try {
        // get current building status before another build
        const buildStatus = await webinizer.getBuildStatus(state.root);
        if (buildStatus === "building" || buildStatus === "building_with_recipes") {
          commit("setBuildingStatus", buildStatus);
          // multiple build for same project is NOT allowed
          // TODO. more actions here to warn users
          return;
        }

        // set building status to "building" / "building_with_recipes" before API call to backend
        if (recipes && recipes.length) {
          commit("setBuildingStatus", "building_with_recipes");
        } else {
          commit("setBuildingStatus", "building");
        }

        const newRecipes = await webinizer.applyRecipesAndBuild(state.root, recipes);
        const newBuildStatus = await webinizer.getBuildStatus(state.root);
        commit("setRecipes", newRecipes);
        commit("setBuildingStatus", newBuildStatus);
        // reset the lastApplyRecipeIndex to -1 when building
        // process finish
        commit("setLastApplyRecipeIndex", -1);
      } catch (error) {
        //NOTE - to reset the build status since the build process
        //       failed this time, reset the `build` button in page
        commit("setBuildingStatus", "idle_fail");
        throw error as Error;
      }
    },

    async getRecipes({ commit, state }) {
      try {
        const recipes = await webinizer.getRecipes(state.root);
        commit("setRecipes", recipes);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchProjectConfig({ commit, state }) {
      try {
        const config = await webinizer.getProjectConfig(state.root);
        commit("setProjectConfig", config);
      } catch (error) {
        throw error as Error;
      }
    },

    async saveProjectConfig({ commit, state }, configToMerge?: { [k: string]: unknown }) {
      try {
        // if (state.needSaveConfig && state.projectConfig) {
        if (state.projectConfig) {
          let config = null;
          if (configToMerge) {
            if (Object.keys(configToMerge).includes("dependencies")) {
              commit("setProjDepUpdateStatus", webinizer.ProjectDepUpdateStatus.processing);
            }
            config = await webinizer.updateProjectConfigPart(state.root, configToMerge);
          } else {
            config = await webinizer.updateProjectConfig(state.root, state.projectConfig);
            commit("setProjDepUpdateStatus", webinizer.ProjectDepUpdateStatus.processing);
          }
          commit("setProjectConfig", config);
          if (state.projDepUpdateStatus === webinizer.ProjectDepUpdateStatus.processing) {
            commit("setProjDepUpdateStatus", webinizer.ProjectDepUpdateStatus.done);
          }
        }
        // commit("setNeedSaveConfig", false);
      } catch (error) {
        commit("setProjDepUpdateStatus", webinizer.ProjectDepUpdateStatus.done);
        throw error as Error;
      }
    },

    async resetProjectConfig({ commit, state }) {
      try {
        const config = await webinizer.resetProjectConfig(state.root);
        commit("setProjectConfig", config);
      } catch (error) {
        throw error as Error;
      }
    },

    async saveProjectBuildConfig({ commit, state }, configToMerge: { [k: string]: unknown }) {
      try {
        const config = await webinizer.updateProjectBuildConfig(state.root, configToMerge);
        commit("setProjectConfig", config);
      } catch (error) {
        throw error as Error;
      }
    },

    async updateProjectConfigDueToDepsUpdate({ commit, state }) {
      try {
        const config = await webinizer.updateOverallEnvsFromDeps(state.root);
        commit("setProjectConfig", config);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchRecommendedBuilders({ commit, state }) {
      try {
        const builders = await webinizer.recommendBuilders(state.root);
        commit("setRecommendedBuilders", builders);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchAllBuilders({ commit, state }) {
      try {
        const builders = await webinizer.getAllBuilders(state.root);
        commit("setAvailableBuilders", builders);
      } catch (error) {
        throw error as Error;
      }
    },

    async disableAdvisor({ commit, state }, advisor: string) {
      try {
        const config = await webinizer.disableAdvisor(state.root, advisor);
        commit("setProjectConfig", config);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchFileContent({ commit, state }, name: string) {
      try {
        const file = await webinizer.getFileContent(state.root, name);
        commit("setFileContent", file);
      } catch (error) {
        throw error as Error;
      }
    },

    async updateFileContent({ commit, state }, file: webinizer.EditFile) {
      try {
        const newFile = await webinizer.updateFileContent(state.root, file.name, file.content);
        commit("setFileContent", newFile);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchLogContent({ commit, state }) {
      try {
        const content = await webinizer.getLogContent(state.root);
        commit("setLogContent", content);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchFileDirPath({ commit, state }) {
      try {
        const content = await webinizer.getFileDirPath(state.root, state.root);
        commit("setFileDirPath", content);
      } catch (error) {
        throw error as Error;
      }
    },

    async getFileDirPath({ state }, path: string) {
      try {
        if (state.fileDirTree.length) {
          const dir = path.substring(0, path.lastIndexOf("/"));
          let root: webinizer.DTreeNode | undefined;
          root = state.fileDirTree[0];
          while (root && root.children !== undefined) {
            if (root && root.path == dir && root.children !== undefined) {
              const content: webinizer.ProjectDirTree | null = await webinizer.getFileDirPath(
                store.state.root,
                root.path
              );
              root.children = content?.tree.children ?? undefined;
              return;
            }
            root = root.children.find(
              (element) => element.type === "directory" && path.startsWith(element.path)
            );
          }
        }
      } catch (error) {
        throw error as Error;
      }
    },

    async getSelectedFileDirPath({ state }, path: string) {
      try {
        if (state.fileDirTree.length) {
          let root: webinizer.DTreeNode | undefined;
          root = state.fileDirTree[0];
          while (root) {
            if (root && !root.children) {
              const content: webinizer.ProjectDirTree | null = await webinizer.getFileDirPath(
                store.state.root,
                root.path
              );
              root.children = content?.tree.children ?? undefined;
            }
            root = (root.children as webinizer.DTreeNode[]).find(
              (element) => element.type === "directory" && path.startsWith(element.path)
            );
          }
        }
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchProjects({ commit }) {
      try {
        const projects = await webinizer.getProjects();
        commit("setProjectPool", projects);
      } catch (error) {
        throw error as Error;
      }
    },

    async saveAsNewFile({ commit, state }, file: webinizer.EditFile) {
      try {
        const newFile = await webinizer.saveAsNewFile(state.root, file.name, file.content);
        commit("setFileContent", newFile);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchTemplateLiterals({ commit, state }) {
      try {
        const templates = await webinizer.getAllTemplateLiterals(state.root);
        commit("setTemplateLiterals", templates);
      } catch (error) {
        throw error as Error;
      }
    },

    async getProjectBuildStatus({ commit, state }) {
      try {
        const status = await webinizer.getBuildStatus(state.root);
        commit("setBuildingStatus", status);
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchBuildResults({ commit, state }) {
      try {
        const results = await webinizer.getBuildResults(state.root);
        commit("setBuildResults", results);
      } catch (error) {
        throw error as Error;
      }
    },

    async uploadProjectFile({ commit }, formData: FormData) {
      try {
        const result = await webinizer.uploadProjectFile(formData);
        commit("setProjAddStatus", result.status);
        if (result.path) commit("setRoot", result.path);
      } catch (error) {
        throw error as Error;
      }
    },

    async cloneProjectFile({ commit }, parameters?: { [k: string]: unknown }) {
      try {
        if (parameters) {
          commit("setProjAddStatus", webinizer.ProjectAddStatus.processing);
          const keys = Object.keys(parameters);
          if (keys.includes("repoPath")) {
            const { repoPath, ...config } = parameters;
            const result = await webinizer.cloneProjectFromRemote(repoPath as string, config);
            if (result.path) {
              commit("setRoot", result.path);
            }
          }
        }
      } catch (error) {
        throw error as Error;
      } finally {
        commit("setProjAddStatus", webinizer.ProjectAddStatus.done);
      }
    },

    async fetchProjectFromRegistry({ commit }, config: { [k: string]: unknown }) {
      try {
        commit("setProjAddStatus", webinizer.ProjectAddStatus.processing);
        const keys = Object.keys(config);
        if (keys.includes("name")) {
          const { name, version, ...rest } = config;
          const result = await webinizer.addProjectFromRegistry(
            { name: name as string, version: version as string },
            rest
          );
          if (result.path) {
            commit("setRoot", result.path);
          }
        }
      } catch (error) {
        throw error as Error;
      } finally {
        commit("setProjAddStatus", webinizer.ProjectAddStatus.done);
      }
    },

    async deleteProject({ commit }, projectPath: string) {
      try {
        const projects = await webinizer.deleteProject(projectPath);
        commit("setProjectPool", projects);
      } catch (error) {
        throw error as Error;
      }
    },

    async publishProject({ commit, state }) {
      try {
        commit("setProjPublishStatus", webinizer.ProjectPublishStatus.processing);
        await webinizer.publish(state.root);
        commit("setProjPublishStatus", webinizer.ProjectPublishStatus.success);
      } catch (error) {
        commit("setProjPublishStatus", webinizer.ProjectPublishStatus.fail);
        throw error as Error;
      }
    },

    async fetchDependencyProjectConfig({ commit, state }, pkgResolution: webinizer.PkgResolution) {
      try {
        const depRoot = state.root.concat("/", pkgResolution.destination);
        const depConfig = await webinizer.getProjectConfig(depRoot);
        commit("setDependencyConfig", { [pkgResolution.destination]: depConfig });
      } catch (error) {
        throw error as Error;
      }
    },

    async fetchWebinizerSettings({ commit }) {
      try {
        const settings = await webinizer.getWebinizerSettings();
        commit("setWebinizerSettings", settings);
      } catch (error) {
        throw error as Error;
      }
    },

    async updateWebinizerSettings({ commit }, settingParts: webinizer.WebinizerSettings) {
      try {
        const settings = await webinizer.updateWebinizerSettings(settingParts);
        commit("setWebinizerSettings", settings);
      } catch (error) {
        throw error as Error;
      }
    },

    async getAllAvailableIcons({ commit, state }) {
      try {
        const icons = await webinizer.getAllAvailableIcons(state.root);
        commit("setAvailableIcons", icons);
      } catch (error) {
        throw error as Error;
      }
    },

    async removeIcon({ commit, state }, img: string) {
      try {
        const icons = await webinizer.removeIcon(state.root, img);
        commit("setAvailableIcons", icons);
      } catch (error) {
        throw error as Error;
      }
    },
  },

  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export function useStore() {
  return baseUseStore(key);
}
