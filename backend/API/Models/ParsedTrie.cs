using System;
using System.Collections;
using System.Collections.Generic;

public class ParsedTrie
{
	ParsedTrieNode root;
	public int id_count;

	public ParsedTrie()
	{
		root = new ParsedTrieNode(0, LookupTable.Tokens.EMPTY, null, -1);
		id_count = 0;
	}

	public void AddNewNode(int depth, Object parentValue, Object value)
	{
		if (root.IsLeaf()) { root.children.Add(new ParsedTrieNode(depth, parentValue, value, id_count++)); return; }

		ArrayList toVisit = new ArrayList(root.children);
		ArrayList Visited = new ArrayList();
		while (toVisit.Count != 0)
		{
			ParsedTrieNode node = (ParsedTrieNode)toVisit[0];
			if (node.value == parentValue && node.depth == depth - 1)
			{
				node.children.Add(new ParsedTrieNode(depth, parentValue, value, id_count++));
				return;
			}
			else
			{
				if (node.IsLeaf() == false)
				{
					foreach (ParsedTrieNode toAdd in node.children)
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
		ArrayList toVisit = new ArrayList(root.children);
		ArrayList Visited = new ArrayList();

		while (toVisit.Count != 0)
		{
			ParsedTrieNode node = (ParsedTrieNode)toVisit[0];
			Console.WriteLine(node);
			if (node.IsLeaf() == false)
			{
				foreach (ParsedTrieNode toAdd in node.children)
				{
					if (!Visited.Contains(toAdd))
						toVisit.Add(toAdd);
				}
			}
			toVisit.Remove(node);
			Visited.Add(node);

		}

	}
}



public class ParsedTrieNode
{
	public int depth {get; set;}
	public Object parent { get; set; }
	public Object value{ get; set; }
	public ArrayList children { get; set; }
	public int id { get; set; }

	public ParsedTrieNode(int depth, Object parent, Object value, int id)
	{
		this.depth = depth;
		this.parent = parent;
		this.value = value;
		this.id = id;
		this.children = new ArrayList();
	}

	public bool IsLeaf() { return this.children.Count == 0 ;  }

	public ParsedTrieNode FindChild(Object value) 
	{
		foreach(ParsedTrieNode child in children)
		{
			if (child.value == value)
			{
				return child;
			}
		}
		return null;
	}

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

	public override string ToString()
	{
		return this.id + "->" + this.value.ToString();
	}

}

