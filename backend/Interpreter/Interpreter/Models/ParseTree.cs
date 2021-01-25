using System;
using System.Collections;
using static Interpreter.Models.LookupTable;

namespace Interpreter.Models
{
	//This is the Trie class
	public class ParseTree
	{
		ParsedTreeNode root;
		public int Deepest_node { get; set; }
		public double Final_result { get; set; }
		public ParsedTreeNode AST { get; set; }

		public ParseTree()
		{
			root = new ParsedTreeNode(0, Tokens.EMPTY, null);
			Final_result = 0;
			AST = new ParsedTreeNode(0, Tokens.EMPTY, null);
		}

		//This function adds new nodes to the trie using their depth and parent value
		public void AddNewNode(int depth, object parentValue, object value)
		{
			if (root.IsLeaf()) { root.Children.Add(new ParsedTreeNode(depth, parentValue, value)); return; }

			ArrayList toVisit = new ArrayList(root.Children);
			ArrayList Visited = new ArrayList();
			while (toVisit.Count != 0)
			{
				ParsedTreeNode node = (ParsedTreeNode)toVisit[0];
				if (node.Value == parentValue && node.Depth == depth - 1)
				{
					node.Children.Add(new ParsedTreeNode(depth, parentValue, value));
					if (depth > Deepest_node)
					{
						Deepest_node = depth;
					}
					return;
				}
				else
				{
					if (node.IsLeaf() == false)
					{
						foreach (ParsedTreeNode toAdd in node.Children)
						{
							if (!Visited.Contains(toAdd))
								toVisit.Insert(0, toAdd);
						}
					}
					toVisit.Remove(node);
					Visited.Add(node);
				}
			}
		}

		public void SetAST()
		{
			AST = new ParsedTreeNode(-1, Tokens.EMPTY, null);

			ArrayList toVisit = new ArrayList { root };
			ArrayList Visited = new ArrayList();
			ArrayList Operators = new ArrayList { Tokens.Plus, Tokens.Minus, Tokens.Multiply, Tokens.Divide, Tokens.Exponent, Tokens.Equal };
			ParsedTreeNode lastOp = AST;

			while (toVisit.Count != 0)
			{
				ParsedTreeNode node = (ParsedTreeNode)toVisit[0];

				if (Operators.Contains(node.Value))
				{
					lastOp.Children.Add(node);
					lastOp = node;
				}
				else if (!(node.Value is null) && !(node.ToString().Contains("<<")))
				{
					lastOp.Children.Add(node);
				}
				if (node.IsLeaf() == false)
				{
					foreach (ParsedTreeNode toAdd in node.Children)
					{
						if (!Visited.Contains(toAdd))
							toVisit.Add(toAdd);
					}
				}
				toVisit.Remove(node);
				Visited.Add(node);
			}

		}

		//This function prints the trie width first
		public void PrintWidthFirst()
		{
			ArrayList toVisit = new ArrayList(root.Children);
			ArrayList Visited = new ArrayList();

			Console.WriteLine("#########");

			while (toVisit.Count != 0)
			{
				ParsedTreeNode node = (ParsedTreeNode)toVisit[0];
				Console.WriteLine(node);
				if (node.IsLeaf() == false)
				{
					foreach (ParsedTreeNode toAdd in node.Children)
					{
						if (!Visited.Contains(toAdd))
							toVisit.Add(toAdd);
					}
				}
				toVisit.Remove(node);
				Visited.Add(node);
			}

			Console.WriteLine("#########");
		}

		//This function prints the trie depth first
		public void PrintDepthFirst()
		{
			ArrayList toVisit = new ArrayList(root.Children);
			ArrayList Visited = new ArrayList();
			ArrayList AddList = new ArrayList();

			Console.WriteLine("#########");

			while (toVisit.Count != 0)
			{
				ParsedTreeNode node = (ParsedTreeNode)toVisit[0];
				Console.WriteLine(node);
				if (node.IsLeaf() == false)
				{
					foreach (ParsedTreeNode toAdd in node.Children)
					{
						if (!Visited.Contains(toAdd))
							AddList.Add(toAdd);
					}
				}
				toVisit.Remove(node);
				toVisit.InsertRange(0, AddList);
				Visited.Add(node);
				AddList.Clear();
			}

			Console.WriteLine("#########");

		}

		//This class is used for nodes on the tree
		public class ParsedTreeNode
		{
			public int Depth { get; set; }
			public Object Parent { get; set; }
			public Object Value { get; set; }
			public ArrayList Children { get; set; }

			public ParsedTreeNode(int depth, Object parent, Object value)
			{
				this.Depth = depth;
				this.Parent = parent;
				this.Value = value;
				this.Children = new ArrayList();
			}

			//Checks if a node is a leaf by checking how many children it has 
			public bool IsLeaf()
			{
				return this.Children.Count == 0;
			}


			//This funciton is used to add children to a given node
			public void AddChild(ParsedTreeNode node)
			{
				this.Children.Add(node);
			}

			public override string ToString()
			{
				if (this.Value == null)
				{
					return "\"<<\"";
				}

				return this.Value.ToString();
			}


		}
	}
}