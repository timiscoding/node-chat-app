require('source-map-support').install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "0b1578eb950161726b76"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + err.stack || err.message);
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + err.stack || err.message);
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./server/controllers/auth.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/auth.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _userValidator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./userValidator */ "./server/controllers/userValidator.js");





const User = mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.model('User');

const loginForm = (req, res) => res.render('login');

// logs in a user
const loginUser = passport__WEBPACK_IMPORTED_MODULE_0___default.a.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'You have logged in',
});

const logoutUser = (req, res) => {
  req.logout();
  req.flash('info', 'You have logged out');
  res.redirect('/');
};

// checks credentials but does not log them in
const authLocal = passport__WEBPACK_IMPORTED_MODULE_0___default.a.authorize('local', {
  failureRedirect: '/link/local',
  failureFlash: 'Email or password is invalid',
});

const linkLocalForm = (req, res) => res.render('link_local');

const genOauthLogin = (provider, config = {}) => ({
  auth(req, res, next) {
    const fn = req.user ? passport__WEBPACK_IMPORTED_MODULE_0___default.a.authorize : passport__WEBPACK_IMPORTED_MODULE_0___default.a.authenticate;
    return fn.call(passport__WEBPACK_IMPORTED_MODULE_0___default.a, provider, config.scope && { scope: config.scope })(req, res, next);
  },
  authCb(req, res, next) {
    const fn = req.user ? passport__WEBPACK_IMPORTED_MODULE_0___default.a.authorize : passport__WEBPACK_IMPORTED_MODULE_0___default.a.authenticate;
    const routes = req.user ?
      {
        failureRedirect: '/profile',
        failureFlash: `${provider} account was not linked`,
      } :
      (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
          req.flash('error', `Permission to login via ${provider} was denied`);
          return res.redirect('/login');
        }

        return req.login(user, (error) => {
          if (error) { return next(error); }
          req.flash('success', `You have logged in, ${user[provider].displayName || user[provider].username}`);
          if (info.firstLogin) { return res.redirect('/profile'); }
          return res.redirect('/');
        });
      };
    return fn.call(passport__WEBPACK_IMPORTED_MODULE_0___default.a, provider, routes)(req, res, next);
  },
});

const linkAccount = async (req, res, next) => {
  const { user, account } = req;

  // user who has already logged in has authorised another account so we need to link them
  if (user && account) {
    const accountObj = account.toObject({
      transform(doc, ret) {
        const newRet = Object.assign({}, ret);
        delete newRet.__v;
        delete newRet._id;
        return newRet;
      },
    });
    if (accountObj.local) {
      /* if req.user is a social account and they try to link to local, then we must delete the
          local account otherwise there will be a duplicate in the db when we try to add the local
          info to the social account. Since the user model doesn't allow duplicate emails, it will
          throw an error if we didn't do this */
      await User.deleteOne({ 'local.email': accountObj.local.email });
    }
    // merge accounts but preserve original username
    Object.assign(user, accountObj, { username: user.username });
    await user.save();
    await account.remove();
    req.flash('success', 'Accounts have been linked');
    return res.redirect('/profile');
  }
  return next();
};

const unlinkAccount = async (req, res, next) => {
  const type = req.params.account;
  const types = ['twitter', 'google', 'facebook', 'local'];
  const { user } = req;
  if (!types.includes(type)) {
    const err = new Error('Unknown account type');
    err.status = 400;
    return next(err);
  }

  if (user.accountsTotal === 1) {
    req.flash('error', 'Unable to unlink solo account');
    return res.redirect('/profile');
  }

  if (type === 'local') {
    const local = Object.assign({}, user.local);
    user.local = undefined;
    await user.save();
    await User.create({ local, username: await User.genUniqueUsername() });
  } else {
    user[type].token = undefined;
    await user.save();
  }
  req.flash('success', 'Account has been unlinked');
  return res.redirect('/profile');
};

const profile = (req, res) => {
  const { user } = req;

  const linkedAccounts = Object.entries(user.toObject()).reduce((all, [type, acc]) => {
    if ((type === 'local' && acc.email) || acc.token) {
      all[type] = acc.email || acc.displayName;
    }
    return all;
  }, {});

  const linkable = ['local', 'twitter', 'google', 'facebook']
    .filter(type => !linkedAccounts[type]);

  res.render('profile', {
    body: { username: req.user.username, email: req.user.local.email },
    linkedAccounts,
    linkable,
  });
};

const preValidateProfile = (req, res, next) => {
  if (req.body.password) {
    return next('route');
  }
  return next();
};

const validateProfile = Object(_userValidator__WEBPACK_IMPORTED_MODULE_2__["validateUserForm"])(Object(_userValidator__WEBPACK_IMPORTED_MODULE_2__["userValidatorSchema"])('username', 'email'), 'profile');
const validateProfilePassword = Object(_userValidator__WEBPACK_IMPORTED_MODULE_2__["validateUserForm"])(Object(_userValidator__WEBPACK_IMPORTED_MODULE_2__["userValidatorSchema"])('username', 'email', 'password', 'password-confirm'), 'profile');

const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  if (username !== req.user.username) {
    req.user.username = username;
  }

  if (req.user.local && email !== req.user.local.email) {
    req.user.local.email = email;
  }

  if (password) {
    req.user.local.password = await User.hashPassword(password);
  }

  await req.user.save();
  req.flash('success', 'Account updated');
  res.redirect('/profile');
};

/* harmony default export */ __webpack_exports__["default"] = ({
  loginForm,
  loginUser,
  logoutUser,
  genOauthLogin,
  profile,
  authLocal,
  linkAccount,
  unlinkAccount,
  linkLocalForm,
  validateProfile,
  updateProfile,
  preValidateProfile,
  validateProfilePassword,
});


/***/ }),

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var request_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! request-promise */ "request-promise");
/* harmony import */ var request_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(request_promise__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _userValidator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./userValidator */ "./server/controllers/userValidator.js");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/helpers */ "./server/utils/helpers.js");
/* harmony import */ var _mailer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../mailer */ "./server/mailer.js");








const User = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User');
const EmailVerifyToken = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('EmailVerifyToken');

const signupForm = (req, res) => {
  res.render('signup', { recaptchaKey: "6LfyMWgUAAAAAOlxOHdpSUhniWaoPwwBzmKJ_4lm" });
};

const validateNewUser = Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["validateUserForm"])(Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["userValidatorSchema"])(), 'signup');

const validateHuman = failureView => async (req, res, next) => {
  const options = {
    method: 'POST',
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    formData: {
      secret: "6LfyMWgUAAAAALL4V5hnZQZ-eiqKnCcKMNJJ6Rvg",
      response: req.body['g-recaptcha-response'],
    },
    json: true,
  };

  try {
    const captchaRes = await request_promise__WEBPACK_IMPORTED_MODULE_2___default()(options);

    if (captchaRes.success) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

  req.flash('error', 'reCaptcha failed. Please try again');
  return res.render(failureView, {
    body: req.body,
    flashes: req.flash(),
    recaptchaKey: "6LfyMWgUAAAAAOlxOHdpSUhniWaoPwwBzmKJ_4lm",
  });
};

const createOne = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const user = await User.create({
      local: { email, password: await User.hashPassword(password) },
      username,
    });

    req.emailToken = await EmailVerifyToken.createToken(user.id);
    next();
  } catch (err) {
    if (err.errors) {
      const keys = Object.keys(err.errors);
      const flashes = keys.map(key => err.errors[key].message);
      req.flash('error', flashes);
      res.render('signup', { body: { username, email }, flashes: req.flash() });
    } else {
      next(err);
    }
  }
};

const sendConfirmEmail = (req, res) => {
  const { email, username } = req.body;

  _mailer__WEBPACK_IMPORTED_MODULE_5__["default"].send({
    template: 'verifyEmail',
    message: {
      to: email,
    },
    locals: {
      name: username,
      confirmURL: `${req.protocol}://${req.hostname}/confirm/${req.emailToken.token}`,
    },
  });

  req.flash('info', `An email has been sent to ${email}. Please confirm your email to complete sign up.`);
  res.redirect('/');
};

const confirmEmail = async (req, res) => {
  const token = await EmailVerifyToken.findOneAndRemove({ token: req.params.token }).populate('user');
  if (!token) {
    req.flash('error', `Email verification invalid. Either the link does not match the one provided
      in the email or the link may have expired. <a href="/resend">Resend email confirmation</a>`);
    return res.redirect('/');
  }

  const { user } = token;
  user.local.isVerified = true;
  await user.save();
  await req.login(user);
  req.flash('success', 'Your email has been confirmed. You are now logged in');
  return res.redirect('/');
};

/* Resend confirmation email */

const requestResend = (req, res) => {
  res.render('confirmEmail', { recaptchaKey: "6LfyMWgUAAAAAOlxOHdpSUhniWaoPwwBzmKJ_4lm" });
};

const validateEmail = Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["validateUserForm"])(Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["userValidatorSchema"])('email'), 'confirmEmail');

const resend = async (req, res, next) => {
  const user = await User.findOne({ 'local.email': req.body.email });

  if (!user || !user.local) {
    req.flash('info', 'An account with this email does not exist');
    return res.render('confirmEmail', { body: req.body, flashes: req.flash() });
  }

  if (user.local && user.local.isVerified) {
    req.flash('info', 'The email for this account is already confirmed');
    return res.redirect('/');
  }

  req.emailToken = await EmailVerifyToken.findOneOrCreate(user.id);
  req.body.username = user.username;
  return next();
};

/* Reset password */

const forgotPasswordForm = (req, res) => {
  res.render('forgotPassword', { recaptchaKey: "6LfyMWgUAAAAAOlxOHdpSUhniWaoPwwBzmKJ_4lm" });
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ 'local.email': req.body.email });

  if (!user || !user.local) {
    req.flash('info', 'An account with this email does not exist');
    return res.render('forgotPassword', { body: req.body, flashes: req.flash() });
  }

  user.passwordResetToken = crypto__WEBPACK_IMPORTED_MODULE_1___default.a.randomBytes(20).toString('hex');
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();
  req.emailToken = user.passwordResetToken;
  req.body.username = user.username;
  return next();
};

const sendResetEmail = (req, res) => {
  const { email, username } = req.body;

  _mailer__WEBPACK_IMPORTED_MODULE_5__["default"].send({
    template: 'resetPassword',
    message: {
      to: email,
    },
    locals: {
      name: username,
      resetURL: `${req.protocol}://${req.hostname}/reset/${req.emailToken}`,
    },
  });

  req.flash('info', `An email has been sent to ${email} with instructions to reset your password.`);
  res.redirect('/');
};

const validResetToken = async (req, res, next) => {
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'This password reset is invalid or expired. Please request a new one');
    return res.redirect('/forgot');
  }
  req.user = user;
  return next();
};

const resetPasswordForm = async (req, res) => {
  res.render('resetPassword');
};

const validatePassword = Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["validateUserForm"])(Object(_userValidator__WEBPACK_IMPORTED_MODULE_3__["userValidatorSchema"])('password', 'password-confirm'), 'resetPassword');

const resetPassword = async (req, res, next) => {
  const { user } = req;

  user.local.password = await User.hashPassword(req.body.password);
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  await req.login(user);
  next();
};

const sendPasswordUpdatedEmail = async (req, res) => {
  const { local: { email }, username } = req.user;

  _mailer__WEBPACK_IMPORTED_MODULE_5__["default"].send({
    template: 'updatedPassword',
    message: {
      to: email,
    },
    locals: {
      name: username,
    },
  });

  req.flash('success', 'Password has been updated');
  res.redirect('/');
};

const getOne = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(`get user\n ${user}`);
};

const updateOne = (req, res) => {
  res.send(`update user\n ${req.docFromId}`);
};

const deleteOne = (req, res) => {
  res.send(`delete user\n ${req.docFromId}`);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  createOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(createOne),
  getOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(getOne),
  updateOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(updateOne),
  deleteOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(deleteOne),
  signupForm,
  validateNewUser,
  confirmEmail: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(confirmEmail),
  requestResend,
  validateEmail,
  resend,
  sendConfirmEmail,
  forgotPasswordForm,
  forgotPassword: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(forgotPassword),
  sendResetEmail,
  resetPasswordForm,
  validatePassword,
  resetPassword: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(resetPassword),
  validResetToken: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(validResetToken),
  sendPasswordUpdatedEmail: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_4__["catchAsyncError"])(sendPasswordUpdatedEmail),
  validateHuman,
});


/***/ }),

/***/ "./server/controllers/userValidator.js":
/*!*********************************************!*\
  !*** ./server/controllers/userValidator.js ***!
  \*********************************************/
/*! exports provided: userValidatorSchema, validateUserForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userValidatorSchema", function() { return userValidatorSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateUserForm", function() { return validateUserForm; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_1__);



const userSchema = {
  username: {
    in: 'body',
    isLength: {
      errorMessage: 'Username must not be empty',
      options: { min: 1 },
    },
    custom: {
      options: (value) => {
        const guestRe = /^guest-\w+$/i;
        const validUserRe = /^[\w-]+$/;
        if (!validUserRe.test(value)) {
          throw new Error("Username must be letters, numbers, '_', ' -' only");
        } else if (guestRe.test(value)) {
          throw new Error("Usernames beginning with 'guest-' are reserved for unregistered users");
        }
        return true;
      },
    },
    trim: true,
  },
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Email address is not valid',
    },
    trim: true,
    normalizeEmail: {
      options: {
        all_lowercase: true,
        gmail_convert_googlemaildotcom: true,
        gmail_remove_dots: true,
        gmail_remove_subaddress: true,
      },
    },
  },
  password: {
    in: 'body',
    isLength: {
      errorMessage: 'Password must be at least 5 characters long',
      options: { min: 5 },
    },
    trim: true,
  },
  'password-confirm': {
    in: 'body',
    custom: {
      options: (value, { req }) => {
        if (req.body.password !== value) {
          throw new Error('Password confirmation does not match password field');
        }
        return true;
      },
    },
  },
};

const userValidatorSchema = (...fields) =>
  (fields.length ? lodash__WEBPACK_IMPORTED_MODULE_0___default.a.pick(userSchema, fields) : userSchema);

const validateUserForm = (schema, view) => [
  Object(express_validator_check__WEBPACK_IMPORTED_MODULE_1__["checkSchema"])(schema),
  (req, res, next) => {
    const errors = Object(express_validator_check__WEBPACK_IMPORTED_MODULE_1__["validationResult"])(req).formatWith(({ msg }) => msg);
    if (errors.isEmpty()) {
      next();
    } else {
      req.flash('error', errors.array({ onlyFirstError: true }));
      res.render(view, {
        body: req.body,
        flashes: req.flash(),
        recaptchaKey: "6LfyMWgUAAAAAOlxOHdpSUhniWaoPwwBzmKJ_4lm" });
    }
  },
];




/***/ }),

/***/ "./server/db.js":
/*!**********************!*\
  !*** ./server/db.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ "./server/models/index.js");



const connect = async () => mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect("mongodb://127.0.0.1/node-chat-app");

/* harmony default export */ __webpack_exports__["default"] = (connect);



/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server */ "./server/server.js");
/* eslint-disable no-console */



const port = "4000" || 4000;
let cServer = _server__WEBPACK_IMPORTED_MODULE_0__["default"];
let cIo = _server__WEBPACK_IMPORTED_MODULE_0__["io"];

if (true) {
  module.hot.accept(/*! ./server */ "./server/server.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server */ "./server/server.js");
(() => {
    console.log('Re-attaching event listeners to updated server module');
    cServer.close();
    _server__WEBPACK_IMPORTED_MODULE_0__["default"].listen(port);
    cServer = _server__WEBPACK_IMPORTED_MODULE_0__["default"];

    cIo.close();
    _server__WEBPACK_IMPORTED_MODULE_0__["io"].attach(cServer);
    cIo = _server__WEBPACK_IMPORTED_MODULE_0__["io"];
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
}

_server__WEBPACK_IMPORTED_MODULE_0__["default"].listen(port, () => {
  console.log(`Server started on port ${port}`);
});


/***/ }),

/***/ "./server/mailer.js":
/*!**************************!*\
  !*** ./server/mailer.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var email_templates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! email-templates */ "email-templates");
/* harmony import */ var email_templates__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(email_templates__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);



const email = new email_templates__WEBPACK_IMPORTED_MODULE_0___default.a({
  message: {
    from: 'no-reply@timiscoding.me',
  },
  // send: true, // uncomment to send emails in dev env
  transport: {
    port: "25",
    host: "smtp.sendgrid.net",
    auth: {
      user: "apikey",
      pass: "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",
    },
  },
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '../views/emails/build'),
    },
  },
  views: {
    root: path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '../views/emails'),
  },
});

/* harmony default export */ __webpack_exports__["default"] = (email);


/***/ }),

/***/ "./server/middleware.js":
/*!******************************!*\
  !*** ./server/middleware.js ***!
  \******************************/
/*! exports provided: session, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "session", function() { return session; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-session */ "express-session");
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_session__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var connect_flash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! connect-flash */ "connect-flash");
/* harmony import */ var connect_flash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(connect_flash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_6__);








const sessionConfig = {
  secret: "keyboardcat",
  resave: false,
  saveUninitialized: false,
};

if (false) {} else if (true) {
  const FileStore = __webpack_require__(/*! session-file-store */ "session-file-store")(express_session__WEBPACK_IMPORTED_MODULE_4___default.a);
  sessionConfig.store = new FileStore();
}

const session = express_session__WEBPACK_IMPORTED_MODULE_4___default()(sessionConfig);

/* harmony default export */ __webpack_exports__["default"] = ([
  express__WEBPACK_IMPORTED_MODULE_0___default.a.static(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '../../public')),
  body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.json(),
  body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.urlencoded({ extended: true }),
  session,
  passport__WEBPACK_IMPORTED_MODULE_3___default.a.initialize(),
  passport__WEBPACK_IMPORTED_MODULE_3___default.a.session(),
  connect_flash__WEBPACK_IMPORTED_MODULE_5___default()(),
]);


/***/ }),

/***/ "./server/models/emailVerifyToken.model.js":
/*!*************************************************!*\
  !*** ./server/models/emailVerifyToken.model.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);



const emailVerifyTokenSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  user: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '5 min',
    default: Date.now,
  },
  token: {
    type: String,
    required: true,
  },
});

const token = () => crypto__WEBPACK_IMPORTED_MODULE_1___default.a.randomBytes(20).toString('hex');

emailVerifyTokenSchema.statics.findOneOrCreate = async function findOneOrCreate(userId) {
  const Token = this;
  if (userId) {
    const foundToken = await Token.findOne({ user: userId });

    return foundToken || Token.create({
      user: userId,
      token: token(),
    });
  }

  return new Error('User id not given');
};

emailVerifyTokenSchema.statics.createToken = async function createToken(userId) {
  const Token = this;
  return Token.create({
    user: userId,
    token: token(),
  });
};

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('EmailVerifyToken', emailVerifyTokenSchema));


/***/ }),

/***/ "./server/models/index.js":
/*!********************************!*\
  !*** ./server/models/index.js ***!
  \********************************/
/*! exports provided: User, EmailVerifyToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.model */ "./server/models/user.model.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "User", function() { return _user_model__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _emailVerifyToken_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emailVerifyToken.model */ "./server/models/emailVerifyToken.model.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EmailVerifyToken", function() { return _emailVerifyToken_model__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./server/models/message.model.js":
/*!****************************************!*\
  !*** ./server/models/message.model.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const messageSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  to: {
    type: String,
    index: true,
    required: true,
  },
  from: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    trim: true,
    minLength: 1,
    required: true,
  },
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Message', messageSchema));


/***/ }),

/***/ "./server/models/room.model.js":
/*!*************************************!*\
  !*** ./server/models/room.model.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const roomSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Room', roomSchema));


/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ "bcrypt");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! validator/lib/isEmail */ "validator/lib/isEmail");
/* harmony import */ var validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mongoose_beautiful_unique_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mongoose-beautiful-unique-validation */ "mongoose-beautiful-unique-validation");
/* harmony import */ var mongoose_beautiful_unique_validation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mongoose_beautiful_unique_validation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);






const userSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  username: {
    type: String,
    required: 'Username is required',
    unique: 'Username already taken',
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+$/, "Username must contain alphanumeric, '-', '_' characters only"],
  },
  local: {
    email: {
      type: String,
      unique: 'An account with email {VALUE} already exists',
      sparse: true, // allows us to add documents without unique fields
      trim: true,
      lowercase: true,
      validate: [validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2___default.a, 'Email is not valid'],
    },
    password: {
      type: String,
      trim: true,
      minlength: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  facebook: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.compare(password, this.local.password);
};

const types = ['twitter', 'google', 'facebook', 'local'];
userSchema.methods.accountsTotal = function accountsTotal() {
  return Object.keys(this.toObject()).reduce((total, f) => {
    if (types.includes(f)) {
      if (f === 'local' || (f !== 'local' && this[f].token)) {
        return total + 1;
      }
    }
    return total;
  }, 0);
};

userSchema.statics.hashPassword = function hashPassword(plaintextPassword) {
  if (!plaintextPassword) {
    throw new Error('Password cannot be blank');
  }
  return bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.hash(plaintextPassword, 12);
};

userSchema.statics.genUniqueUsername = async function genUniqueUsername(name = 'anon') {
  const snakeCase = name.toLowerCase().replace(/ /g, '_');
  const usernameRegex = new RegExp(`^${snakeCase}\d*$`);
  const usernames = await this.find({ username: usernameRegex }, 'username');
  let newUsername = snakeCase;
  // find the first unique username with format username<incrementing number>
  for (let i = 0; lodash__WEBPACK_IMPORTED_MODULE_4___default.a.find(usernames, { username: newUsername }); i += 1) {
    newUsername = snakeCase + (usernames.length + i);
  }
  return newUsername;
};

// if client tries creating a duplicate on a unique field, it will produce a low level
// mongo db error. This plugin transforms that error into a mongoose validation error
// that exists in an 'errors' object
userSchema.plugin(mongoose_beautiful_unique_validation__WEBPACK_IMPORTED_MODULE_3___default.a);

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', userSchema));


/***/ }),

/***/ "./server/passport.js":
/*!****************************!*\
  !*** ./server/passport.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var passport_local__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! passport-local */ "passport-local");
/* harmony import */ var passport_local__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(passport_local__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var passport_facebook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! passport-facebook */ "passport-facebook");
/* harmony import */ var passport_facebook__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(passport_facebook__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var passport_twitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! passport-twitter */ "passport-twitter");
/* harmony import */ var passport_twitter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(passport_twitter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var passport_google_oauth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! passport-google-oauth */ "passport-google-oauth");
/* harmony import */ var passport_google_oauth__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(passport_google_oauth__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);








const User = mongoose__WEBPACK_IMPORTED_MODULE_5___default.a.model('User');

passport__WEBPACK_IMPORTED_MODULE_0___default.a.use(new passport_local__WEBPACK_IMPORTED_MODULE_1___default.a(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ 'local.email': email });
      if (!user) {
        return done(null, false, { message: 'Email or password is invalid' });
      }

      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Email or password is invalid' });
      }

      if (!user.local.isVerified) {
        return done(null, false, { message: 'The email has not been verified for this account. <a href="/resend">Resend email confirmation</a>' });
      }

      /* user is either
         a) already logged in via oauth and trying to link this local account so the user will be
         injected into req.account
         b) logging into their local account so the user will be injected into req.user */
      return done(null, user);
    } catch (err) {
      return done(err, null, { message: 'Could not authenticate. Please try again' });
    }
  },
));

const getEmail = profile => profile.emails && profile.emails.length && profile.emails[0].value;
const createAccount = async (provider, token, profile) => User.create({
  [provider]: {
    id: profile.id,
    displayName: profile.displayName,
    token,
    email: getEmail(profile),
  },
  username: await User.genUniqueUsername(profile.username || profile.displayName),
});

const genOauthCb = provider => async (req, accessToken, refreshTokenOrSecret, profile, done) => {
  try {
    let user = await User.findOne({ [`${provider}.id`]: profile.id });
    if (!req.user) { // not already logged in
      if (user) {
        if (!user[provider].token) { // user unlinked this account but has logged in later
          user[provider] = {
            id: profile.id,
            displayName: profile.displayName,
            token: accessToken,
            email: getEmail(profile),
          };
          user = await user.save();
        }
        return done(null, user);
      }

      user = await createAccount(provider, accessToken, profile);

      /* when a user logs in for the first time, we need a way to inform the authController so that
         they can send them to a profile page to let them change their username if they want.
         firstLogin is my own custom prop that will be sent to the custom callback whenever
         passport.auth(enticate|orize)() is called
         */
      return done(null, user, { firstLogin: true });
    }
    /* user already logged in and trying to link another account  */

    /* if user tries to link an already linked account, just return the original user */
    if (user) {
      /* user previously unlinked account and now wants to relink it.
        we must update the token and other profile info */
      if (!user[provider].token) {
        user = await createAccount(provider, accessToken, profile);
      }
      return done(null, user);
    }

    /* user linking an account they have never authorised before so lets create it first */
    user = await createAccount(provider, accessToken, profile);

    return done(null, user);
  } catch (err) {
    return done(err, false, { message: 'Could not authenticate. Please try again' });
  }
};

passport__WEBPACK_IMPORTED_MODULE_0___default.a.use(new passport_facebook__WEBPACK_IMPORTED_MODULE_2___default.a(
  {
    clientID: "356245058235370",
    clientSecret: "11142581536181170c73f99a1a517322",
    callbackURL: `${"https://lvh.me"}/auth/facebook/callback`,
    profileFields: ['email', 'displayName'],
    passReqToCallback: true,
  },
  genOauthCb('facebook'),
));

passport__WEBPACK_IMPORTED_MODULE_0___default.a.use(new passport_twitter__WEBPACK_IMPORTED_MODULE_3___default.a(
  {
    consumerKey: "yDLpdwfDqhfEvkziizEYKn9Qo",
    consumerSecret: "Ws0zoogEc0KA0hJ4A0kWQ6iW3FPSfVKCJcMJ2bfdTIDjoKEHeW",
    callbackURL: `${"https://lvh.me"}/auth/twitter/callback`,
    passReqToCallback: true,
  },
  genOauthCb('twitter'),
));

passport__WEBPACK_IMPORTED_MODULE_0___default.a.use(new passport_google_oauth__WEBPACK_IMPORTED_MODULE_4__["OAuth2Strategy"](
  {
    clientID: "504908865203-3jta8usdj6u5si25pp6fatpta3sls723.apps.googleusercontent.com",
    clientSecret: "A5DU6vs21AVlaECoIX-ikUxl",
    callbackURL: `${"https://lvh.me"}/auth/google/callback`,
    passReqToCallback: true,
  },
  genOauthCb('google'),
));

passport__WEBPACK_IMPORTED_MODULE_0___default.a.serializeUser((user, done) => done(null, user.id));
passport__WEBPACK_IMPORTED_MODULE_0___default.a.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


/***/ }),

/***/ "./server/routes/auth.router.js":
/*!**************************************!*\
  !*** ./server/routes/auth.router.js ***!
  \**************************************/
/*! exports provided: authRouter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authRouter", function() { return authRouter; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ "./server/controllers/auth.controller.js");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/helpers */ "./server/utils/helpers.js");





const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

const authRouter = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

authRouter.get('/login', _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].loginForm);
authRouter.post('/login', _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].loginUser);
authRouter.get('/logout', isLoggedIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].logoutUser);
authRouter.get('/profile', isLoggedIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].profile);
authRouter.post('/profile', isLoggedIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].preValidateProfile, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].validateProfile, Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_2__["catchAsyncError"])(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].updateProfile));
authRouter.post('/profile', _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].validateProfilePassword, Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_2__["catchAsyncError"])(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].updateProfile));
authRouter.get('/link/local', isLoggedIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].linkLocalForm);
authRouter.post('/link/local', isLoggedIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].authLocal, Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_2__["catchAsyncError"])(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].linkAccount));
authRouter.post('/unlink/:account', isLoggedIn, Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_2__["catchAsyncError"])(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].unlinkAccount));

[
  {
    provider: 'facebook',
    config: {
      scope: 'email',
    },
  },
  { provider: 'twitter' },
  {
    provider: 'google',
    config: {
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    },
  },
].forEach(({ provider, config }) => {
  const { auth, authCb } = _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].genOauthLogin(provider, config);
  authRouter.get(`/auth/${provider}`, auth);
  authRouter.get(`/auth/${provider}/callback`, authCb, Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_2__["catchAsyncError"])(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__["default"].linkAccount));
  authRouter.get(`/link/${provider}`, isLoggedIn, auth);
});


/***/ }),

/***/ "./server/routes/index.js":
/*!********************************!*\
  !*** ./server/routes/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _user_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user.router */ "./server/routes/user.router.js");
/* harmony import */ var _auth_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.router */ "./server/routes/auth.router.js");




const routes = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

routes.use('/', _auth_router__WEBPACK_IMPORTED_MODULE_2__["authRouter"]);
routes.use('/', _user_router__WEBPACK_IMPORTED_MODULE_1__["userRouter"]);

routes.get('/', (req, res) => {
  res.render('index', { title: 'Join' });
});

routes.post('/chat', (req, res) => {
  res.render('chat', { title: 'Chat' });
});

// handle mongoose validation errors
routes.use((err, req, res, next) => {
  if (!err.errors) {
    return next(err);
  }

  const validationErrors = Object.keys(err.errors);

  if (validationErrors.length > 0) {
    validationErrors.forEach(e => req.flash('error', err.errors[e].message));
  }
  return res.redirect('back');
});

routes.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;

  res.status(status).render('error', {
    status,
    message:  true ? err : undefined,
  });
});

/* harmony default export */ __webpack_exports__["default"] = (routes);


/***/ }),

/***/ "./server/routes/user.router.js":
/*!**************************************!*\
  !*** ./server/routes/user.router.js ***!
  \**************************************/
/*! exports provided: userRouter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userRouter", function() { return userRouter; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! connect-ensure-login */ "connect-ensure-login");
/* harmony import */ var connect_ensure_login__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/user.controller */ "./server/controllers/user.controller.js");





const userRouter = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
const User = mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.model('User');

userRouter.param('id', async (req, res, next, id) => {
  try {
    if (!mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error('No user found');
    } else {
      req.docFromId = user;
      next();
    }
  } catch (err) {
    next(err.message);
  }
});

userRouter.route('/signup')
  .get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].signupForm)
  .post(
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateNewUser,
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateHuman('signup'),
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].createOne,
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].sendConfirmEmail,
  );

userRouter.route('/user/:id')
  .get(Object(connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__["ensureLoggedIn"])(), _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].getOne)
  .put(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].updateOne)
  .delete(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].deleteOne);

userRouter.route('/resend')
  .get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].requestResend)
  .post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateEmail, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateHuman('confirmEmail'), _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].resend, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].sendConfirmEmail);
userRouter.get('/confirm/:token', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].confirmEmail);

userRouter.route('/forgot')
  .get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].forgotPasswordForm)
  .post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateEmail, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validateHuman('forgotPassword'), _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].forgotPassword, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].sendResetEmail);

userRouter.route('/reset/:token')
  .get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validResetToken, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].resetPasswordForm)
  .post(
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validResetToken,
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].validatePassword,
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].resetPassword,
    _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].sendPasswordUpdatedEmail,
  );


/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/*! exports provided: default, io */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return server; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "io", function() { return io; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var es6_promisify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! es6-promisify */ "es6-promisify");
/* harmony import */ var es6_promisify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(es6_promisify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./db */ "./server/db.js");
/* harmony import */ var _passport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./passport */ "./server/passport.js");
/* harmony import */ var _mailer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mailer */ "./server/mailer.js");
/* harmony import */ var _socketEvent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./socketEvent */ "./server/socketEvent.js");
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./middleware */ "./server/middleware.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./routes */ "./server/routes/index.js");
/* eslint-disable no-console */













const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
const server = http__WEBPACK_IMPORTED_MODULE_1___default.a.createServer(app);
const io = socket_io__WEBPACK_IMPORTED_MODULE_2___default()(server);
Object(_db__WEBPACK_IMPORTED_MODULE_4__["default"])().catch(err => console.error('Could not connect to DB', err.message));

app.set('view engine', 'pug');

/* without this, express incorrectly gets wrong header info because it thinks requests are coming
   from nginx so for eg. req.protocol would be 'http' when it should be 'https' */
app.set('trust proxy', true);

app.use(_middleware__WEBPACK_IMPORTED_MODULE_8__["default"]);

io.use((socket, next) => {
  Object(_middleware__WEBPACK_IMPORTED_MODULE_8__["session"])(socket.handshake, {}, next);
});

io.on('connection', (socket) => {
  console.log('New user connected');
  Object(_socketEvent__WEBPACK_IMPORTED_MODULE_7__["default"])(socket, io);
});

// convert callback based methods to use promises
app.use((req, res, next) => {
  req.login = Object(es6_promisify__WEBPACK_IMPORTED_MODULE_3__["promisify"])(req.login.bind(req));
  next();
});

// pass variables to all templates
app.use((req, res, next) => {
  const flashes = req.flash();
  res.locals.user = req.user;
  res.locals.flashes = Object.keys(flashes).length > 0 ? flashes : undefined;
  next();
});
app.use('/', _routes__WEBPACK_IMPORTED_MODULE_9__["default"]);




/***/ }),

/***/ "./server/socketEvent.js":
/*!*******************************!*\
  !*** ./server/socketEvent.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/validation */ "./server/utils/validation.js");
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/message */ "./server/utils/message.js");
/* harmony import */ var _utils_users__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/users */ "./server/utils/users.js");
/* harmony import */ var _models_room_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/room.model */ "./server/models/room.model.js");
/* harmony import */ var _models_message_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/message.model */ "./server/models/message.model.js");








const users = _utils_users__WEBPACK_IMPORTED_MODULE_3__["default"].getInstance();
const User = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User');

// update room list for people joining a room
const updateUserJoining = (io) => {
  io.emit('updateRoomList', { rooms: users.getRoomList() });
};

const joinRoom = (socket, io) => socket.on('join', async (params, callback) => {
  if (!Object(_utils_validation__WEBPACK_IMPORTED_MODULE_1__["default"])(params.room)) {
    return callback('Room name required!');
  }

  const roomName = params.room.trim().toLowerCase();
  socket.join(roomName);

  const { passport } = socket.handshake.session;
  let name, mongoUserId;
  if (passport && passport.user) {
    try {
      const user = await User.findById(passport.user);
      name = user.username;
      mongoUserId = user.id;
    } catch (err) {
      return callback('Could not retrieve user information');
    }
  } else {
    const objectId = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId;
    name = `guest-${objectId.toString().slice(-4)}`;
    await User.create({ username: name, _id: objectId });
    mongoUserId = objectId.toString();
  }

  try {
    const room = await _models_room_model__WEBPACK_IMPORTED_MODULE_4__["default"].findOne({ name: roomName });

    if (!room) {
      await _models_room_model__WEBPACK_IMPORTED_MODULE_4__["default"].create({ name: roomName });
    }
  } catch (err) {
    return callback('Could not create room');
  }

  let messages;
  try {
    messages = await _models_message_model__WEBPACK_IMPORTED_MODULE_5__["default"]
      .find({ to: roomName }, { _id: 0 }, { sort: { createdAt: 1 }})
      .populate('from', { username: 1, _id: 0 });
  } catch (err) {
    return callback('Could not get message history');
  }

  users.removeUser(socket.id);
  users.addUser(socket.id, name, roomName, mongoUserId);
  io.to(roomName).emit('updateUserList', users.getUserList(roomName));
  socket.emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_2__["generateMessage"])('Admin', `Welcome to the room ${roomName}!`));
  socket.broadcast.to(roomName).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_2__["generateMessage"])('Admin', `${name} joined the chat`));

  updateUserJoining(io);
  return callback(null, messages);
});

const createMessage = (socket, io) => socket.on('createMessage', async (message, callback) => {
  const user = users.getUser({ id: socket.id });

  if (user && Object(_utils_validation__WEBPACK_IMPORTED_MODULE_1__["default"])(message.text)) {
    try {
      await _models_message_model__WEBPACK_IMPORTED_MODULE_5__["default"].create({ from: user.mongoId, to: user.room, content: message.text });
    } catch (err) {
      return callback('Error persisting message to db');
    }

    io.to(user.room).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_2__["generateMessage"])(user.name, message.text));
  }
  callback();
});

const createLocationMessage = (socket, io) => socket.on('createLocationMessage', (coords) => {
  const user = users.getUser({ id: socket.id });

  if (user) {
    io.to(user.room).emit('newLocationMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_2__["generateLocationMessage"])(user.name, coords.latitude, coords.longitude));
  }
});

const disconnect = (socket, io) => socket.on('disconnect', () => {
  const user = users.removeUser(socket.id);

  io.to(user.room).emit('updateUserList', users.getUserList(user.room));
  io.to(user.room).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_2__["generateMessage"])('Admin', `${user.name} has left`));
  updateUserJoining(io);
});

const getRoomList = socket => socket.on('getRoomList', (_, callback) => {
  callback({ rooms: users.getRoomList() });
});

/* harmony default export */ __webpack_exports__["default"] = ((socket, io) => ({
  joinRoom: joinRoom(socket, io),
  createMessage: createMessage(socket, io),
  createLocationMessage: createLocationMessage(socket, io),
  disconnect: disconnect(socket, io),
  getRoomList: getRoomList(socket, io),
}));


/***/ }),

/***/ "./server/utils/helpers.js":
/*!*********************************!*\
  !*** ./server/utils/helpers.js ***!
  \*********************************/
/*! exports provided: catchAsyncError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "catchAsyncError", function() { return catchAsyncError; });
const catchAsyncError = fn => (req, res, next) => fn(req, res, next).catch(next);


/***/ }),

/***/ "./server/utils/message.js":
/*!*********************************!*\
  !*** ./server/utils/message.js ***!
  \*********************************/
/*! exports provided: generateMessage, generateLocationMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateMessage", function() { return generateMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateLocationMessage", function() { return generateLocationMessage; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);


const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: moment__WEBPACK_IMPORTED_MODULE_0___default()().valueOf(),
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: moment__WEBPACK_IMPORTED_MODULE_0___default()().valueOf(),
});


/***/ }),

/***/ "./server/utils/users.js":
/*!*******************************!*\
  !*** ./server/utils/users.js ***!
  \*******************************/
/*! exports provided: default, UsersClass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersClass", function() { return UsersClass; });
class UsersClass {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room, mongoId) {
    const user = { id, name, room, mongoId };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const userToRemove = Object.assign({}, this.getUser({ id }));

    if (userToRemove) {
      this.users = this.users.filter(user => user.id !== userToRemove.id);
    }

    return userToRemove;
  }

  getUser({ id, name }) {
    return this.users.find(user => user.id === id || user.name === name);
  }

  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    const namesArray = users.map(user => user.name);

    return namesArray;
  }

  getRoomList() {
    const rooms = new Set(this.users.map(user => user.room));
    return [...rooms];
  }
}

const Users = (() => {
  let instance;

  const createInstance = () => new UsersClass();

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

/* harmony default export */ __webpack_exports__["default"] = (Users);



/***/ }),

/***/ "./server/utils/validation.js":
/*!************************************!*\
  !*** ./server/utils/validation.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const isRealString = string => typeof string === 'string' && string.trim().length > 0;

/* harmony default export */ __webpack_exports__["default"] = (isRealString);


/***/ }),

/***/ 0:
/*!********************************************************!*\
  !*** multi ./server/index.js webpack/hot/poll.js?1000 ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./server/index.js */"./server/index.js");
module.exports = __webpack_require__(/*! webpack/hot/poll.js?1000 */"./node_modules/webpack/hot/poll.js?1000");


/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "connect-ensure-login":
/*!***************************************!*\
  !*** external "connect-ensure-login" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-ensure-login");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-flash");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "email-templates":
/*!**********************************!*\
  !*** external "email-templates" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("email-templates");

/***/ }),

/***/ "es6-promisify":
/*!********************************!*\
  !*** external "es6-promisify" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("es6-promisify");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "express-validator/check":
/*!******************************************!*\
  !*** external "express-validator/check" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator/check");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "mongoose-beautiful-unique-validation":
/*!*******************************************************!*\
  !*** external "mongoose-beautiful-unique-validation" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose-beautiful-unique-validation");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-facebook":
/*!************************************!*\
  !*** external "passport-facebook" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),

/***/ "passport-google-oauth":
/*!****************************************!*\
  !*** external "passport-google-oauth" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-google-oauth");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),

/***/ "passport-twitter":
/*!***********************************!*\
  !*** external "passport-twitter" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-twitter");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "request-promise":
/*!**********************************!*\
  !*** external "request-promise" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request-promise");

/***/ }),

/***/ "session-file-store":
/*!*************************************!*\
  !*** external "session-file-store" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("session-file-store");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "validator/lib/isEmail":
/*!****************************************!*\
  !*** external "validator/lib/isEmail" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("validator/lib/isEmail");

/***/ })

/******/ });
//# sourceMappingURL=server.bundle.js.map