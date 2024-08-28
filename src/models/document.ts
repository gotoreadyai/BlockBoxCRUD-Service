import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Workspace from "./workspace";
import User from "./user";
import { generateUniqueSlug } from "../utils/slugGenerator";

interface DocumentAttributes {
  id: string;
  title: string;
  content: Record<string, any>;
  workspaceId: string;
  ownerId: string;
  slug: string;
}

interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, "id"> {}

class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  public id!: string;
  public title!: string;
  public content!: Record<string, any>;
  public workspaceId!: string;
  public ownerId!: string;
  public slug!: string;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Workspaces",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Document",
    hooks: {
      beforeCreate: async (document: Document) => {
        document.slug = await generateUniqueSlug(
          Document,
          document.title,
          document.id
        );
      },
    },
  }
);

// Relacja z modelem User
Document.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Poprawione relacje
Document.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(Document, { foreignKey: "workspaceId" });

export default Document;
