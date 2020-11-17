using System;
using System.Collections;
using System.Collections.Generic;
using static LookupTable;
using static LookupTable.Symbol;

public class ParsedTrie
{
	ParsedTrieNode root;
	public int id_count;

	public ParsedTrie()
	{
		root = new ParsedTrieNode(0, Tokens.EMPTY, null);
	}

	public void AddNewNode(int depth, Object parentValue, Object value)
	{
		if (root.IsLeaf()) { root.Children.Add(new ParsedTrieNode(depth, parentValue, value)); return; }

		ArrayList toVisit = new ArrayList(root.Children);
		ArrayList Visited = new ArrayList();
		while (toVisit.Count != 0)
		{
			ParsedTrieNode node = (ParsedTrieNode)toVisit[0];
			if (node.Value == parentValue && node.Depth == depth - 1)
			{
				node.Children.Add(new ParsedTrieNode(depth, parentValue, value));
				return;
			}
			else
			{
				if (node.IsLeaf() == false)
				{
					foreach (ParsedTrieNode toAdd in node.Children)
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

	public void PrintWidthFirst()
	{
		ArrayList toVisit = new ArrayList(root.Children);
		ArrayList Visited = new ArrayList();

		while (toVisit.Count != 0)
		{
			ParsedTrieNode node = (ParsedTrieNode)toVisit[0];
			Console.WriteLine(node);
			if (node.IsLeaf() == false)
			{
				foreach (ParsedTrieNode toAdd in node.Children)
				{
					if (!Visited.Contains(toAdd))
						toVisit.Add(toAdd);
				}
			}
			toVisit.Remove(node);
			Visited.Add(node);
		}
	}

	public void PrintDepthFirst()
	{
		ArrayList toVisit = new ArrayList(root.Children);
		ArrayList Visited = new ArrayList();
		ArrayList AddList = new ArrayList();

		while (toVisit.Count != 0)
		{
			ParsedTrieNode node = (ParsedTrieNode)toVisit[0];
			Console.WriteLine(node);
			if (node.IsLeaf() == false)
			{
				foreach (ParsedTrieNode toAdd in node.Children)
				{
					if (!Visited.Contains(toAdd))
						AddList.Add(toAdd);
				}
			}
			toVisit.Remove(node);
			toVisit.InsertRange(0, AddList);
			AddList.Reverse();
			Visited.Add(node);
			AddList.Clear();
		}

	}



	public class ParsedTrieNode
	{
		public int Depth { get; set; }
		public Object Parent { get; set; }
		public Object Value { get; set; }
		public ArrayList Children { get; set; }

		public ParsedTrieNode(int depth, Object parent, Object value)
		{
			this.Depth = depth;
			this.Parent = parent;
			this.Value = value;
			this.Children = new ArrayList();
		}

		public bool IsLeaf() { return this.Children.Count == 0; }

		public ParsedTrieNode FindChild(Object value)
		{
			foreach (ParsedTrieNode child in Children)
			{
				if (child.Value == value)
				{
					return child;
				}
			}
			return null;
		}

		/*
		public bool RemoveChild(Object value)
		{
			foreach (ParsedTrieNode child in children)
			{
				if (child.value == value)
				{
					children.Remove(child);
					return true;
				}
			}
			return false;
		}
		*/

		public override string ToString()
		{
			return this.Depth + " " + this.Value.ToString();
		}

		public bool IsString()
		{
			return this.Value is string;
		}
	}
}

