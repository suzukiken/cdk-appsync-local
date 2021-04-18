import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";

export class CdkappsyncLocalStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLowerCase().replace('stack', '')

    // appsync api

    const api = new appsync.GraphqlApi(this, "api", {
      name: PREFIX_NAME + "-api",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      schema: new appsync.Schema({
        filePath: "graphql/schema.graphql",
      }),
    });

    // AppSync Datasource

    const none_datasource = new appsync.NoneDataSource(this, 'datasource', {
      api: api
    })
    
    //AppSync Resolver

    none_datasource.createResolver({
      typeName: "Query",
      fieldName: "get",
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        `{
          "version": "2018-05-29",
          "payload": {
            "message": "hello"
          }
        }`
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `$util.toJson($ctx.result)`
      ),
    })
    
  }
}
