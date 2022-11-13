"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var ethers_1 = require("ethers");
var dayjs = __importStar(require("dayjs"));
var model_1 = require("../../../domain/model");
var EtherscanService = /** @class */ (function () {
    function EtherscanService(properties, restClient) {
        this.properties = properties;
        this.restClient = restClient;
    }
    EtherscanService.prototype.GetNormalTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, body, txns;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateRequest("txlist", "")];
                    case 1:
                        response = _a.sent();
                        body = _.get(response, "result", null);
                        if (body) {
                            txns = _.isArray(body) && body.map(function (txn) { return _this.mapToTransaction(txn); });
                            return [2 /*return*/, txns];
                        }
                        throw new Error("Cannot get normal transcations");
                }
            });
        });
    };
    EtherscanService.prototype.GetERC20Transactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestToEtherscan, responseFromEtherscan, txnFormatted;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestToEtherscan = EtherscanService.ERC20_CONTRACTS.map(function (contract) { return _this.generateRequest("tokentx", contract); });
                        return [4 /*yield*/, Promise.all(requestToEtherscan)];
                    case 1:
                        responseFromEtherscan = _a.sent();
                        txnFormatted = responseFromEtherscan
                            .filter(function (response) { return response.status < 204; })
                            .map(function (response) {
                            var body = _.get(response, "result", null);
                            return _.isArray(body) && body.map(function (txn) { return _this.mapToTransaction(txn); });
                        });
                        return [2 /*return*/, _.flatMap(txnFormatted)];
                }
            });
        });
    };
    EtherscanService.prototype.generateRequest = function (action, contract) {
        var params = {
            module: "account",
            action: action,
            address: this.properties.address,
            contractaddress: contract || "",
            startblock: "0",
            endblock: "99999999",
            page: "1",
            offset: "10",
            sort: "desc",
            apikey: this.properties.token,
        };
        return this.restClient.request("get", "/api", params);
    };
    EtherscanService.prototype.mapToTransaction = function (txn) {
        var amount = ethers_1.ethers.utils.formatUnits(txn.value, txn.tokenDecimal || 18);
        return {
            to: txn.to,
            from: txn.from,
            type: txn.to === this.properties.address
                ? model_1.TransactionType.TransferIn
                : model_1.TransactionType.TransferOut,
            amount: "$".concat(amount.toString(), " ").concat(txn.tokenSymbol || "ETH"),
            txn_id: txn.hash.slice(0, 5) +
                txn.hash.slice(txn.hash.length - 5, txn.hash.length),
            token: "".concat(txn.tokenName || "Ethereum"),
            date: dayjs.unix(txn.timeStamp).format("MM/DD/YYYY HH:mm"),
        };
    };
    EtherscanService.ERC20_CONTRACTS = [
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    ];
    return EtherscanService;
}());
exports.default = EtherscanService;
