const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { publishEvent } = require('../shared/events');

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /exceptions - List exceptions with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      entity_id,
      account_id,
      severity,
      status = 'open',
      exception_type,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    let query = supabase
      .from('exceptions')
      .select(`
        id,
        entity_id,
        account_id,
        exception_type,
        severity,
        status,
        description,
        metadata,
        created_at,
        updated_at,
        resolved_at,
        resolved_by,
        resolution_notes,
        accounts(account_number, institution_id),
        entities(entity_name)
      `, { count: 'exact' });

    // Apply filters
    if (entity_id) {
      query = query.eq('entity_id', entity_id);
    }
    if (account_id) {
      query = query.eq('account_id', account_id);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (exception_type) {
      query = query.eq('exception_type', exception_type);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: exceptions, error, count } = await query;

    if (error) {
      console.error('Error fetching exceptions:', error);
      return res.status(500).json({ error: 'Failed to fetch exceptions' });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      data: exceptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        total_pages: totalPages,
        has_next: hasNext,
        has_prev: hasPrev
      }
    });

  } catch (error) {
    console.error('Exception listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /exceptions/:id - Get exception details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exception, error } = await supabase
      .from('exceptions')
      .select(`
        *,
        accounts(account_number, institution_id, entity_id),
        entities(entity_name),
        exception_comments(
          id,
          comment,
          created_at,
          created_by,
          profiles(first_name, last_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Exception not found' });
      }
      console.error('Error fetching exception:', error);
      return res.status(500).json({ error: 'Failed to fetch exception' });
    }

    res.json(exception);

  } catch (error) {
    console.error('Exception detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /exceptions/:id/acknowledge - Acknowledge an exception
router.post('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledged_by, notes } = req.body;

    const { data: exception, error } = await supabase
      .from('exceptions')
      .update({
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: acknowledged_by,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error acknowledging exception:', error);
      return res.status(500).json({ error: 'Failed to acknowledge exception' });
    }

    // Add comment if provided
    if (notes) {
      await supabase
        .from('exception_comments')
        .insert({
          exception_id: id,
          comment: notes,
          created_by: acknowledged_by,
          created_at: new Date().toISOString()
        });
    }

    // Publish event
    await publishEvent({
      kind: 'exception.acknowledged',
      payload: {
        exception_id: id,
        acknowledged_by: acknowledged_by,
        notes: notes
      },
      entity_id: exception.entity_id
    });

    res.json({ 
      message: 'Exception acknowledged successfully',
      exception: exception
    });

  } catch (error) {
    console.error('Exception acknowledge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /exceptions/:id/resolve - Resolve an exception
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved_by, resolution_notes, resolution_action } = req.body;

    if (!resolved_by || !resolution_notes) {
      return res.status(400).json({ 
        error: 'resolved_by and resolution_notes are required' 
      });
    }

    const { data: exception, error } = await supabase
      .from('exceptions')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolved_by,
        resolution_notes: resolution_notes,
        resolution_action: resolution_action,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error resolving exception:', error);
      return res.status(500).json({ error: 'Failed to resolve exception' });
    }

    // Add resolution comment
    await supabase
      .from('exception_comments')
      .insert({
        exception_id: id,
        comment: `Resolved: ${resolution_notes}`,
        created_by: resolved_by,
        created_at: new Date().toISOString()
      });

    // Publish event
    await publishEvent({
      kind: 'exception.resolved',
      payload: {
        exception_id: id,
        resolved_by: resolved_by,
        resolution_notes: resolution_notes,
        resolution_action: resolution_action
      },
      entity_id: exception.entity_id
    });

    res.json({ 
      message: 'Exception resolved successfully',
      exception: exception
    });

  } catch (error) {
    console.error('Exception resolve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /exceptions/:id/comment - Add comment to exception
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, created_by } = req.body;

    if (!comment || !created_by) {
      return res.status(400).json({ 
        error: 'comment and created_by are required' 
      });
    }

    const { data: newComment, error } = await supabase
      .from('exception_comments')
      .insert({
        exception_id: id,
        comment: comment,
        created_by: created_by,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        profiles(first_name, last_name)
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Exception comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /exceptions/summary - Get exceptions summary
router.get('/summary', async (req, res) => {
  try {
    const { entity_id, days = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();

    let query = supabase
      .from('exceptions')
      .select('severity, status, exception_type, created_at');

    if (entity_id) {
      query = query.eq('entity_id', entity_id);
    }

    query = query.gte('created_at', since);

    const { data: exceptions, error } = await query;

    if (error) {
      console.error('Error fetching exceptions summary:', error);
      return res.status(500).json({ error: 'Failed to fetch summary' });
    }

    // Calculate summary statistics
    const summary = {
      total: exceptions.length,
      by_severity: {},
      by_status: {},
      by_type: {},
      recent_trend: []
    };

    // Count by severity
    exceptions.forEach(ex => {
      summary.by_severity[ex.severity] = (summary.by_severity[ex.severity] || 0) + 1;
    });

    // Count by status
    exceptions.forEach(ex => {
      summary.by_status[ex.status] = (summary.by_status[ex.status] || 0) + 1;
    });

    // Count by type
    exceptions.forEach(ex => {
      summary.by_type[ex.exception_type] = (summary.by_type[ex.exception_type] || 0) + 1;
    });

    // Calculate daily trend for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayExceptions = exceptions.filter(ex => ex.created_at.startsWith(date));
      summary.recent_trend.push({
        date: date,
        count: dayExceptions.length,
        high_severity: dayExceptions.filter(ex => ex.severity === 'high').length
      });
    }

    res.json(summary);

  } catch (error) {
    console.error('Exception summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;