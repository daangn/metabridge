import assert from "assert";
import dedent from "dedent";
import exec from "exec-sh";
import fs from "fs/promises";
import path from "path";

(async () => {
  const command = [
    "yarn",
    "metabridge-cli",
    "--plugin",
    "@metabridge/plugin-swift",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.swift",
  ].join(" ");

  await exec.promise(command, true);

  const output = await fs.readFile(
    path.resolve("./test/schema.output.swift"),
    "utf-8"
  );

  assert.equal(
    output,
    dedent`
      // This file was generated from JSON Schema using quicktype, do not modify it directly.
      // To parse the JSON, add this file to your project and do:
      //
      //   let myAppBridgeSchema = try MyAppBridgeSchema(json)
      
      import Foundation
      
      enum MyAppBridgeSchema: Codable {
          case anythingArray([JSONAny])
          case bool(Bool)
          case double(Double)
          case integer(Int)
          case myAppBridgeSchemaClass(MyAppBridgeSchemaClass)
          case string(String)
          case null
      
          init(from decoder: Decoder) throws {
              let container = try decoder.singleValueContainer()
              if let x = try? container.decode(Bool.self) {
                  self = .bool(x)
                  return
              }
              if let x = try? container.decode(Int.self) {
                  self = .integer(x)
                  return
              }
              if let x = try? container.decode([JSONAny].self) {
                  self = .anythingArray(x)
                  return
              }
              if let x = try? container.decode(Double.self) {
                  self = .double(x)
                  return
              }
              if let x = try? container.decode(String.self) {
                  self = .string(x)
                  return
              }
              if let x = try? container.decode(MyAppBridgeSchemaClass.self) {
                  self = .myAppBridgeSchemaClass(x)
                  return
              }
              if container.decodeNil() {
                  self = .null
                  return
              }
              throw DecodingError.typeMismatch(MyAppBridgeSchema.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for MyAppBridgeSchema"))
          }
      
          func encode(to encoder: Encoder) throws {
              var container = encoder.singleValueContainer()
              switch self {
              case .anythingArray(let x):
                  try container.encode(x)
              case .bool(let x):
                  try container.encode(x)
              case .double(let x):
                  try container.encode(x)
              case .integer(let x):
                  try container.encode(x)
              case .myAppBridgeSchemaClass(let x):
                  try container.encode(x)
              case .string(let x):
                  try container.encode(x)
              case .null:
                  try container.encodeNil()
              }
          }
      }
      
      // MARK: - MyAppBridgeSchemaClass
      class MyAppBridgeSchemaClass: Codable {
          let storageGetRequestBody: StorageGetRequestBody
          let storageGetResponse: StorageGetResponse
      
          enum CodingKeys: String, CodingKey {
              case storageGetRequestBody = "StorageGetRequestBody"
              case storageGetResponse = "StorageGetResponse"
          }
      
          init(storageGetRequestBody: StorageGetRequestBody, storageGetResponse: StorageGetResponse) {
              self.storageGetRequestBody = storageGetRequestBody
              self.storageGetResponse = storageGetResponse
          }
      }
      
      // MARK: MyAppBridgeSchemaClass convenience initializers and mutators
      
      extension MyAppBridgeSchemaClass {
          convenience init(data: Data) throws {
              let me = try newJSONDecoder().decode(MyAppBridgeSchemaClass.self, from: data)
              self.init(storageGetRequestBody: me.storageGetRequestBody, storageGetResponse: me.storageGetResponse)
          }
      
          convenience init(_ json: String, using encoding: String.Encoding = .utf8) throws {
              guard let data = json.data(using: encoding) else {
                  throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
              }
              try self.init(data: data)
          }
      
          convenience init(fromURL url: URL) throws {
              try self.init(data: try Data(contentsOf: url))
          }
      
          func with(
              storageGetRequestBody: StorageGetRequestBody? = nil,
              storageGetResponse: StorageGetResponse? = nil
          ) -> MyAppBridgeSchemaClass {
              return MyAppBridgeSchemaClass(
                  storageGetRequestBody: storageGetRequestBody ?? self.storageGetRequestBody,
                  storageGetResponse: storageGetResponse ?? self.storageGetResponse
              )
          }
      
          func jsonData() throws -> Data {
              return try newJSONEncoder().encode(self)
          }
      
          func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
              return String(data: try self.jsonData(), encoding: encoding)
          }
      }
      
      // MARK: - StorageGetRequestBody
      class StorageGetRequestBody: Codable {
          let key: String
      
          init(key: String) {
              self.key = key
          }
      }
      
      // MARK: StorageGetRequestBody convenience initializers and mutators
      
      extension StorageGetRequestBody {
          convenience init(data: Data) throws {
              let me = try newJSONDecoder().decode(StorageGetRequestBody.self, from: data)
              self.init(key: me.key)
          }
      
          convenience init(_ json: String, using encoding: String.Encoding = .utf8) throws {
              guard let data = json.data(using: encoding) else {
                  throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
              }
              try self.init(data: data)
          }
      
          convenience init(fromURL url: URL) throws {
              try self.init(data: try Data(contentsOf: url))
          }
      
          func with(
              key: String? = nil
          ) -> StorageGetRequestBody {
              return StorageGetRequestBody(
                  key: key ?? self.key
              )
          }
      
          func jsonData() throws -> Data {
              return try newJSONEncoder().encode(self)
          }
      
          func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
              return String(data: try self.jsonData(), encoding: encoding)
          }
      }
      
      // MARK: - StorageGetResponse
      class StorageGetResponse: Codable {
          let value: String
      
          init(value: String) {
              self.value = value
          }
      }
      
      // MARK: StorageGetResponse convenience initializers and mutators
      
      extension StorageGetResponse {
          convenience init(data: Data) throws {
              let me = try newJSONDecoder().decode(StorageGetResponse.self, from: data)
              self.init(value: me.value)
          }
      
          convenience init(_ json: String, using encoding: String.Encoding = .utf8) throws {
              guard let data = json.data(using: encoding) else {
                  throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
              }
              try self.init(data: data)
          }
      
          convenience init(fromURL url: URL) throws {
              try self.init(data: try Data(contentsOf: url))
          }
      
          func with(
              value: String? = nil
          ) -> StorageGetResponse {
              return StorageGetResponse(
                  value: value ?? self.value
              )
          }
      
          func jsonData() throws -> Data {
              return try newJSONEncoder().encode(self)
          }
      
          func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
              return String(data: try self.jsonData(), encoding: encoding)
          }
      }
      
      // MARK: - Helper functions for creating encoders and decoders
      
      func newJSONDecoder() -> JSONDecoder {
          let decoder = JSONDecoder()
          if #available(iOS 10.0, OSX 10.12, tvOS 10.0, watchOS 3.0, *) {
              decoder.dateDecodingStrategy = .iso8601
          }
          return decoder
      }
      
      func newJSONEncoder() -> JSONEncoder {
          let encoder = JSONEncoder()
          if #available(iOS 10.0, OSX 10.12, tvOS 10.0, watchOS 3.0, *) {
              encoder.dateEncodingStrategy = .iso8601
          }
          return encoder
      }
      
      // MARK: - Encode/decode helpers
      
      class JSONNull: Codable, Hashable {
      
          public static func == (lhs: JSONNull, rhs: JSONNull) -> Bool {
              return true
          }
      
          public var hashValue: Int {
              return 0
          }
      
          public init() {}
      
          public required init(from decoder: Decoder) throws {
              let container = try decoder.singleValueContainer()
              if !container.decodeNil() {
                  throw DecodingError.typeMismatch(JSONNull.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for JSONNull"))
              }
          }
      
          public func encode(to encoder: Encoder) throws {
              var container = encoder.singleValueContainer()
              try container.encodeNil()
          }
      }
      
      class JSONCodingKey: CodingKey {
          let key: String
      
          required init?(intValue: Int) {
              return nil
          }
      
          required init?(stringValue: String) {
              key = stringValue
          }
      
          var intValue: Int? {
              return nil
          }
      
          var stringValue: String {
              return key
          }
      }
      
      class JSONAny: Codable {
      
          let value: Any
      
          static func decodingError(forCodingPath codingPath: [CodingKey]) -> DecodingError {
              let context = DecodingError.Context(codingPath: codingPath, debugDescription: "Cannot decode JSONAny")
              return DecodingError.typeMismatch(JSONAny.self, context)
          }
      
          static func encodingError(forValue value: Any, codingPath: [CodingKey]) -> EncodingError {
              let context = EncodingError.Context(codingPath: codingPath, debugDescription: "Cannot encode JSONAny")
              return EncodingError.invalidValue(value, context)
          }
      
          static func decode(from container: SingleValueDecodingContainer) throws -> Any {
              if let value = try? container.decode(Bool.self) {
                  return value
              }
              if let value = try? container.decode(Int64.self) {
                  return value
              }
              if let value = try? container.decode(Double.self) {
                  return value
              }
              if let value = try? container.decode(String.self) {
                  return value
              }
              if container.decodeNil() {
                  return JSONNull()
              }
              throw decodingError(forCodingPath: container.codingPath)
          }
      
          static func decode(from container: inout UnkeyedDecodingContainer) throws -> Any {
              if let value = try? container.decode(Bool.self) {
                  return value
              }
              if let value = try? container.decode(Int64.self) {
                  return value
              }
              if let value = try? container.decode(Double.self) {
                  return value
              }
              if let value = try? container.decode(String.self) {
                  return value
              }
              if let value = try? container.decodeNil() {
                  if value {
                      return JSONNull()
                  }
              }
              if var container = try? container.nestedUnkeyedContainer() {
                  return try decodeArray(from: &container)
              }
              if var container = try? container.nestedContainer(keyedBy: JSONCodingKey.self) {
                  return try decodeDictionary(from: &container)
              }
              throw decodingError(forCodingPath: container.codingPath)
          }
      
          static func decode(from container: inout KeyedDecodingContainer<JSONCodingKey>, forKey key: JSONCodingKey) throws -> Any {
              if let value = try? container.decode(Bool.self, forKey: key) {
                  return value
              }
              if let value = try? container.decode(Int64.self, forKey: key) {
                  return value
              }
              if let value = try? container.decode(Double.self, forKey: key) {
                  return value
              }
              if let value = try? container.decode(String.self, forKey: key) {
                  return value
              }
              if let value = try? container.decodeNil(forKey: key) {
                  if value {
                      return JSONNull()
                  }
              }
              if var container = try? container.nestedUnkeyedContainer(forKey: key) {
                  return try decodeArray(from: &container)
              }
              if var container = try? container.nestedContainer(keyedBy: JSONCodingKey.self, forKey: key) {
                  return try decodeDictionary(from: &container)
              }
              throw decodingError(forCodingPath: container.codingPath)
          }
      
          static func decodeArray(from container: inout UnkeyedDecodingContainer) throws -> [Any] {
              var arr: [Any] = []
              while !container.isAtEnd {
                  let value = try decode(from: &container)
                  arr.append(value)
              }
              return arr
          }
      
          static func decodeDictionary(from container: inout KeyedDecodingContainer<JSONCodingKey>) throws -> [String: Any] {
              var dict = [String: Any]()
              for key in container.allKeys {
                  let value = try decode(from: &container, forKey: key)
                  dict[key.stringValue] = value
              }
              return dict
          }
      
          static func encode(to container: inout UnkeyedEncodingContainer, array: [Any]) throws {
              for value in array {
                  if let value = value as? Bool {
                      try container.encode(value)
                  } else if let value = value as? Int64 {
                      try container.encode(value)
                  } else if let value = value as? Double {
                      try container.encode(value)
                  } else if let value = value as? String {
                      try container.encode(value)
                  } else if value is JSONNull {
                      try container.encodeNil()
                  } else if let value = value as? [Any] {
                      var container = container.nestedUnkeyedContainer()
                      try encode(to: &container, array: value)
                  } else if let value = value as? [String: Any] {
                      var container = container.nestedContainer(keyedBy: JSONCodingKey.self)
                      try encode(to: &container, dictionary: value)
                  } else {
                      throw encodingError(forValue: value, codingPath: container.codingPath)
                  }
              }
          }
      
          static func encode(to container: inout KeyedEncodingContainer<JSONCodingKey>, dictionary: [String: Any]) throws {
              for (key, value) in dictionary {
                  let key = JSONCodingKey(stringValue: key)!
                  if let value = value as? Bool {
                      try container.encode(value, forKey: key)
                  } else if let value = value as? Int64 {
                      try container.encode(value, forKey: key)
                  } else if let value = value as? Double {
                      try container.encode(value, forKey: key)
                  } else if let value = value as? String {
                      try container.encode(value, forKey: key)
                  } else if value is JSONNull {
                      try container.encodeNil(forKey: key)
                  } else if let value = value as? [Any] {
                      var container = container.nestedUnkeyedContainer(forKey: key)
                      try encode(to: &container, array: value)
                  } else if let value = value as? [String: Any] {
                      var container = container.nestedContainer(keyedBy: JSONCodingKey.self, forKey: key)
                      try encode(to: &container, dictionary: value)
                  } else {
                      throw encodingError(forValue: value, codingPath: container.codingPath)
                  }
              }
          }
      
          static func encode(to container: inout SingleValueEncodingContainer, value: Any) throws {
              if let value = value as? Bool {
                  try container.encode(value)
              } else if let value = value as? Int64 {
                  try container.encode(value)
              } else if let value = value as? Double {
                  try container.encode(value)
              } else if let value = value as? String {
                  try container.encode(value)
              } else if value is JSONNull {
                  try container.encodeNil()
              } else {
                  throw encodingError(forValue: value, codingPath: container.codingPath)
              }
          }
      
          public required init(from decoder: Decoder) throws {
              if var arrayContainer = try? decoder.unkeyedContainer() {
                  self.value = try JSONAny.decodeArray(from: &arrayContainer)
              } else if var container = try? decoder.container(keyedBy: JSONCodingKey.self) {
                  self.value = try JSONAny.decodeDictionary(from: &container)
              } else {
                  let container = try decoder.singleValueContainer()
                  self.value = try JSONAny.decode(from: container)
              }
          }
      
          public func encode(to encoder: Encoder) throws {
              if let arr = self.value as? [Any] {
                  var container = encoder.unkeyedContainer()
                  try JSONAny.encode(to: &container, array: arr)
              } else if let dict = self.value as? [String: Any] {
                  var container = encoder.container(keyedBy: JSONCodingKey.self)
                  try JSONAny.encode(to: &container, dictionary: dict)
              } else {
                  var container = encoder.singleValueContainer()
                  try JSONAny.encode(to: &container, value: self.value)
              }
          }
      }
      
      enum MyAppBridgeSchemaQueryName: String {
        case undefined
        case storageGet = "STORAGE.GET"
      }
    ` + "\n"
  );
})();
